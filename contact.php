<?php
declare(strict_types=1);

/* Mentor And I — contact form.
   Self-posting: this one file renders the form and handles the submission.
   No JavaScript, no cookies, no third-party services — the anti-spam is
   entirely server-side so the Cookie Policy stays accurate.

   State (HMAC secret + rate-limit counters) lives OUTSIDE the document root
   and outside the git repo, so nothing secret is ever published. */

const RECIPIENT   = 'support@mentorandi.com';
const MAIL_FROM   = 'support@mentorandi.com';   // must be on our own domain or SPF fails
const STATE_DIR   = '/home/stepston/.mentorandi-contact';
const MIN_SECONDS = 4;                          // faster than this is a script
const FORM_TTL    = 7200;                       // 2 h before a form token expires
const MAX_HOUR    = 4;
const MAX_DAY     = 12;

const TOPICS = [
    'general'  => 'General question',
    'account'  => 'Account or login',
    'billing'  => 'Billing and subscription',
    'privacy'  => 'Privacy or data request',
    'press'    => 'Press and partnerships',
    'other'    => 'Something else',
];

function state_dir(): string {
    if (!is_dir(STATE_DIR)) { @mkdir(STATE_DIR, 0700, true); }
    return STATE_DIR;
}

function secret(): string {
    static $s = null;
    if ($s !== null) return $s;
    $f = state_dir() . '/secret';
    if (!is_file($f)) {
        $new = bin2hex(random_bytes(32));
        file_put_contents($f, $new, LOCK_EX);
        @chmod($f, 0600);
        return $s = $new;
    }
    return $s = trim((string) file_get_contents($f));
}

function make_token(int $ts): string {
    return hash_hmac('sha256', (string) $ts, secret());
}

function client_ip(): string {
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

/* Sliding window per IP. The IP is never stored — only an HMAC of it. */
function rate_ok(string $ip): bool {
    $dir  = state_dir();
    $f    = $dir . '/rl_' . substr(hash_hmac('sha256', $ip, secret()), 0, 32);
    $now  = time();
    $hits = [];
    if (is_file($f)) {
        foreach (explode(',', (string) file_get_contents($f)) as $t) {
            $t = (int) $t;
            if ($t > $now - 86400) $hits[] = $t;
        }
    }
    $lastHour = 0;
    foreach ($hits as $t) { if ($t > $now - 3600) $lastHour++; }
    if ($lastHour >= MAX_HOUR || count($hits) >= MAX_DAY) return false;

    $hits[] = $now;
    file_put_contents($f, implode(',', $hits), LOCK_EX);

    /* Occasionally sweep counter files nobody has touched for two days. */
    if (random_int(1, 40) === 1) {
        foreach ((array) glob($dir . '/rl_*') as $old) {
            if (is_file($old) && filemtime($old) < $now - 172800) @unlink($old);
        }
    }
    return true;
}

/* Append-only archive, one file per month, readable only by the account owner.
   Deliberately kept outside the document root so it can never be fetched over
   HTTP, and outside the git repo so it is never published. */
function archive(string $record): void {
    $f = state_dir() . '/messages-' . gmdate('Y-m') . '.txt';
    $new = !is_file($f);
    @file_put_contents($f, "\n" . str_repeat('=', 70) . "\n" . $record, FILE_APPEND | LOCK_EX);
    if ($new) @chmod($f, 0600);
}

function clean(string $v): string {
    /* Strip CR/LF so nothing can be injected into a mail header. */
    return trim(preg_replace('/[\r\n\t\0\x0B]+/', ' ', $v));
}

function enc_subject(string $s): string {
    return function_exists('mb_encode_mimeheader')
        ? mb_encode_mimeheader($s, 'UTF-8', 'B')
        : $s;
}

function e(?string $s): string {
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$errors = [];
$sent   = isset($_GET['sent']);
$old    = ['name' => '', 'email' => '', 'topic' => 'general', 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $old['name']    = clean((string) ($_POST['name']    ?? ''));
    $old['email']   = clean((string) ($_POST['email']   ?? ''));
    $old['topic']   = (string) ($_POST['topic']   ?? 'general');
    $old['message'] = trim((string) ($_POST['message'] ?? ''));

    /* 1. Honeypot. A real browser never fills this — drop silently so the
          bot gets no signal about why it failed. */
    if (($_POST['website'] ?? '') !== '') {
        header('Location: /contact.php?sent=1', true, 303);
        exit;
    }

    /* 2. Signed timestamp: proves the form came from us and measures fill time. */
    $ts  = (int) ($_POST['ts'] ?? 0);
    $tok = (string) ($_POST['tok'] ?? '');
    $age = time() - $ts;
    if ($ts <= 0 || !hash_equals(make_token($ts), $tok) || $age > FORM_TTL) {
        $errors[] = 'This form has been open too long. Please send it again — your text is still here.';
    } elseif ($age < MIN_SECONDS) {
        $errors[] = 'That was submitted unusually fast. Please press send once more.';
    }

    if ($old['name'] === '' || mb_strlen($old['name']) > 80) {
        $errors[] = 'Please give us a name we can use, up to 80 characters.';
    }
    if (!filter_var($old['email'], FILTER_VALIDATE_EMAIL) || mb_strlen($old['email']) > 160) {
        $errors[] = 'Please check the email address — we need a working one to reply to.';
    }
    if (!isset(TOPICS[$old['topic']])) {
        $old['topic'] = 'general';
    }
    if (mb_strlen($old['message']) < 20) {
        $errors[] = 'Please write at least a sentence or two so we can actually help.';
    } elseif (mb_strlen($old['message']) > 5000) {
        $errors[] = 'That message is longer than 5,000 characters. Please shorten it.';
    }

    if (!$errors && !rate_ok(client_ip())) {
        $errors[] = 'Several messages have already been sent from this connection. '
                  . 'Please wait an hour, or email support@mentorandi.com directly.';
    }

    if (!$errors) {
        /* Link-heavy messages are flagged, never dropped — a real person may
           legitimately need to send us a URL. */
        $links = preg_match_all('~https?://|www\.~i', $old['message']);
        $flag  = $links > 3 ? '[possible spam] ' : '';

        $subject = $flag . '[mentorandi.com] ' . TOPICS[$old['topic']] . ' — ' . $old['name'];

        $body = "New message from the mentorandi.com contact form.\n\n"
              . 'Name:   ' . $old['name'] . "\n"
              . 'Email:  ' . $old['email'] . "\n"
              . 'Topic:  ' . TOPICS[$old['topic']] . "\n"
              . 'Sent:   ' . gmdate('Y-m-d H:i') . " UTC\n"
              . 'Source: ' . substr(hash_hmac('sha256', client_ip(), secret()), 0, 10)
              . " (hashed sender, not an IP address)\n\n"
              . str_repeat('-', 60) . "\n\n"
              . $old['message'] . "\n\n"
              . str_repeat('-', 60) . "\n"
              . "Reply to this email to answer the sender directly.\n";

        $headers = implode("\r\n", [
            'From: Mentor And I website <' . MAIL_FROM . '>',
            'Reply-To: ' . $old['email'],
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            'X-Mailer: mentorandi-contact',
        ]);

        /* Every submission is archived outside the document root before we try
           to send it. mail() returning true only means the local MTA accepted
           the message — it can still bounce later. The archive means a genuine
           enquiry is never lost to a mail-routing problem. */
        archive($body);

        if (@mail(RECIPIENT, enc_subject($subject), $body, $headers, '-f' . MAIL_FROM)) {
            header('Location: /contact.php?sent=1', true, 303);
            exit;
        }
        $errors[] = 'Something went wrong sending the message. '
                  . 'Please email support@mentorandi.com directly and we will pick it up there.';
    }
}

$ts  = time();
$tok = make_token($ts);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact | Mentor And I</title>
<meta name="description" content="Get in touch with the team behind Mentor And I. Questions about your account, billing, privacy or the mentors themselves.">
<link rel="canonical" href="https://mentorandi.com/contact.php">
<meta name="robots" content="index, follow">
<meta property="og:title" content="Contact | Mentor And I">
<meta property="og:description" content="Get in touch with the team behind Mentor And I. Questions about your account, billing, privacy or the mentors themselves.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://mentorandi.com/contact.php">
<meta property="og:site_name" content="Mentor And I">
<meta property="og:locale" content="en_GB">
<meta property="og:image" content="https://mentorandi.com/images/og/contact.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Contact — Mentor And I">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Contact | Mentor And I">
<meta name="twitter:description" content="Get in touch with the team behind Mentor And I. Questions about your account, billing, privacy or the mentors themselves.">
<meta name="twitter:image" content="https://mentorandi.com/images/og/contact.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/legal.css">
<link rel="stylesheet" href="/site-footer.css">
<style>
/* Contact form — brand tokens only, no new colours or fonts. */
.cf{margin:1.8rem 0 0}
.cf-row{margin-bottom:1.15rem}
.cf label{display:block;font-size:.82rem;font-weight:600;color:var(--ink);margin-bottom:.4rem}
.cf .hint{font-weight:400;color:var(--text-faint);font-size:.78rem;margin-left:.35rem}
.cf input,.cf select,.cf textarea{
  width:100%;font:inherit;font-size:1rem;color:var(--ink);
  background:var(--surface);border:1px solid var(--line-strong);border-radius:12px;
  padding:.72rem .9rem;transition:border-color .25s var(--ease),box-shadow .25s var(--ease);
}
.cf textarea{min-height:11rem;resize:vertical;line-height:1.65}
.cf input:focus,.cf select:focus,.cf textarea:focus{
  outline:none;border-color:var(--h);box-shadow:0 0 0 3px color-mix(in srgb,var(--h) 16%,transparent);
}
.cf select{appearance:none;cursor:pointer;
  background-image:url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236A6456' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 1rem center;padding-right:2.6rem;
}
.cf-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.cf-send{
  appearance:none;border:none;cursor:pointer;font:inherit;font-weight:600;font-size:.95rem;
  color:#fff;background:var(--h);padding:.8rem 1.7rem;border-radius:100px;
  box-shadow:0 6px 16px rgba(188,91,56,0.28);transition:background .3s var(--ease);
}
.cf-send:hover{background:#9E4A2C}
.cf-foot{display:flex;align-items:center;gap:1.1rem;flex-wrap:wrap;margin-top:1.4rem}
.cf-foot p{margin:0;font-size:.82rem;color:var(--text-faint);max-width:26rem}
.cf-msg{border-radius:14px;padding:1rem 1.25rem;margin:1.6rem 0;font-size:.95rem}
.cf-msg.bad{background:color-mix(in srgb,#BC5B38 9%,var(--surface));
  border:1px solid color-mix(in srgb,#BC5B38 32%,transparent);color:var(--ink)}
.cf-msg.good{background:var(--surface);border:1px solid var(--line);
  border-left:3px solid var(--h);color:var(--text)}
.cf-msg ul{margin:.5rem 0 0 1.1rem}
.cf-msg li{margin-bottom:.3rem}
.cf-msg strong{color:var(--ink)}
</style>
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@graph": [
  {
   "@type": "ContactPage",
   "@id": "https://mentorandi.com/contact.php#page",
   "url": "https://mentorandi.com/contact.php",
   "name": "Contact | Mentor And I",
   "description": "Get in touch with the team behind Mentor And I. Questions about your account, billing, privacy or the mentors themselves.",
   "inLanguage": "en-GB",
   "isPartOf": {
    "@type": "WebSite",
    "@id": "https://mentorandi.com/#website",
    "url": "https://mentorandi.com/",
    "name": "Mentor And I"
   },
   "publisher": {
    "@type": "Organization",
    "@id": "https://mentorandi.com/#org",
    "name": "Mentor AI Corp",
    "alternateName": "Mentor And I",
    "url": "https://mentorandi.com/",
    "logo": {
     "@type": "ImageObject",
     "url": "https://mentorandi.com/images/MentorAndIlogo.png",
     "width": 1106,
     "height": 220
    }
   },
   "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://mentorandi.com/images/og/contact.jpg",
    "width": 1200,
    "height": 630
   }
  },
  {
   "@type": "BreadcrumbList",
   "@id": "https://mentorandi.com/contact.php#crumbs",
   "itemListElement": [
    {
     "@type": "ListItem",
     "position": 1,
     "name": "Home",
     "item": "https://mentorandi.com/"
    },
    {
     "@type": "ListItem",
     "position": 2,
     "name": "Contact",
     "item": "https://mentorandi.com/contact.php"
    }
   ]
  }
 ]
}
</script>
</head>
<body>

<nav><div class="wrap">
  <div class="nav-left">
    <a class="brand" href="/index.html" aria-label="Mentor And I home"><img class="nav-logo" src="/images/MentorAndIlogo.png" alt="Mentor And I" height="30" width="150"></a>
  </div>
  <input class="nav-check" id="navtoggle" type="checkbox" tabindex="-1" aria-hidden="true">
  <div class="nav-menu">
    <a href="/index.html#mentors">Mentors</a>
    <a href="/index.html#why">Why a mentor</a>
    <a href="/index.html#how">How it works</a>
    <a href="/articles/">Insights</a>
    <a href="/index.html#pricing">Pricing</a>
    <a href="/index.html#faq">FAQ</a>
  </div>
  <div class="nav-actions">
    <a class="nav-cta" href="/index.html#start">Start free</a>
    <label class="nav-burger" for="navtoggle" aria-label="Open menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></label>
  </div>
</div></nav>

<header class="lg-head"><div class="wrap">
  <h1 class="serif">Contact</h1>
  <p class="lg-intro">Questions about your account, your subscription, your data, or the mentors themselves. A real person reads every message, and we aim to reply within two working days.</p>
</div></header>

<main class="lg-body"><div class="wrap">

<?php if ($sent): ?>
  <div class="cf-msg good">
    <p><strong>Thank you — your message is on its way.</strong></p>
    <p>We will reply to the address you gave us, usually within two working days. If it is urgent, you can also write to <a href="mailto:support@mentorandi.com">support@mentorandi.com</a>.</p>
  </div>
  <p><a href="/index.html">Back to the homepage</a> or <a href="/articles/">read the Insights articles</a>.</p>
<?php else: ?>

  <div class="lg-note">
    <p>Mentor And I is not therapy, medical care or crisis support, and this form is not monitored around the clock. If you or someone else may be in immediate danger, please contact your local emergency service or a qualified professional straight away.</p>
  </div>

  <?php if ($errors): ?>
    <div class="cf-msg bad">
      <strong>Please check the following:</strong>
      <ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul>
    </div>
  <?php endif; ?>

  <form class="cf" method="post" action="/contact.php">
    <input type="hidden" name="ts"  value="<?= e((string) $ts) ?>">
    <input type="hidden" name="tok" value="<?= e($tok) ?>">

    <div class="cf-hp" aria-hidden="true">
      <label for="website">Leave this field empty</label>
      <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
    </div>

    <div class="cf-row">
      <label for="name">Your name</label>
      <input type="text" id="name" name="name" maxlength="80" required autocomplete="name" value="<?= e($old['name']) ?>">
    </div>

    <div class="cf-row">
      <label for="email">Email <span class="hint">so we can reply</span></label>
      <input type="email" id="email" name="email" maxlength="160" required autocomplete="email" value="<?= e($old['email']) ?>">
    </div>

    <div class="cf-row">
      <label for="topic">What is it about?</label>
      <select id="topic" name="topic">
        <?php foreach (TOPICS as $k => $label): ?>
          <option value="<?= e($k) ?>"<?= $old['topic'] === $k ? ' selected' : '' ?>><?= e($label) ?></option>
        <?php endforeach; ?>
      </select>
    </div>

    <div class="cf-row">
      <label for="message">Message</label>
      <textarea id="message" name="message" maxlength="5000" required><?= e($old['message']) ?></textarea>
    </div>

    <div class="cf-foot">
      <button class="cf-send" type="submit">Send message</button>
      <p>We use what you send here only to answer you. See the <a href="/privacy.html">Privacy Policy</a>.</p>
    </div>
  </form>

<?php endif; ?>

<div class="lg-other">
  <a href="/terms.html">Terms of Use</a>
  <a href="/privacy.html">Privacy Policy</a>
  <a href="/consumer-health-data-privacy.html">Consumer Health Data Privacy</a>
  <a href="/ai-safety.html">AI Safety</a>
  <a href="/cookies.html">Cookie Policy</a>
</div>

</div></main>

<footer>
  <div class="wrap">
    <div class="ft-top">
      <div class="ft-brand">
        <a class="ft-logo" href="/index.html" aria-label="Mentor And I"><img src="/images/MentorAndIlogo.png" alt="Mentor And I" width="161" height="32"></a>
        <p>A relationship that remembers. Specialized AI mentors built around how people actually grow.</p>
      </div>
      <div class="ft-cols">
        <div class="ft-col">
          <h4>Product</h4>
          <a href="/index.html#how">How it works</a>
          <a href="/index.html#mentors">Meet the mentors</a>
          <a href="/index.html#pricing">Pricing</a>
          <a href="/index.html#trust">Trust &amp; care</a>
          <a href="/index.html#start">Get started</a>
        </div>
        <div class="ft-col">
          <h4>Company</h4>
          <a href="https://mentoraicorp.com">Mentor AI Corp</a>
          <a href="/contact.php">Contact</a>
        </div>
        <div class="ft-col">
          <h4>Legal</h4>
          <a href="/terms.html">Terms of Use</a>
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/consumer-health-data-privacy.html">Consumer Health Data Privacy</a>
          <a href="/ai-safety.html">AI Safety</a>
          <a href="/cookies.html">Cookie Policy</a>
        </div>
      </div>
    </div>
    <div class="ft-legal">
      <p>Mentor And I uses artificial intelligence. AI mentors are not human and are not licensed therapists or healthcare professionals. Mentor And I provides mentoring, coaching, educational and self-help support &mdash; not therapy, diagnosis, treatment or emergency care.</p>
      <span class="copy">© 2026 Mentor AI Corp. All rights reserved.</span>
    </div>
  </div>
</footer>

</body>
</html>
