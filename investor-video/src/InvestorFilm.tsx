import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {hanken, newsreader, spaceMono} from "./fonts";

export const TOTAL_FRAMES = 2340;

const C = {
  paper: "#F4EDE1",
  band: "#EFE6D4",
  surface: "#FBF7EF",
  raised: "#FEFCF8",
  ink: "#201F1B",
  muted: "#5C574D",
  faint: "#6E675C",
  line: "#E3D9C6",
  lineStrong: "#8F887A",
  terra: "#BC5B38",
  terraDeep: "#9E4A2C",
  mauve: "#A0637A",
  olive: "#9A7B3A",
  gold: "#C68A38",
};

const LOGO = "https://mentorandi.com/images/MentorAndIlogo.png";

const mentors = [
  {
    name: "Marcus",
    role: "Life Mentor",
    color: "#BC5B38",
    image: "https://mentorandi.com/images/mentors/profiles/marcus-life-mentor.webp",
  },
  {
    name: "Adrian",
    role: "ADHD Mentor",
    color: "#C68A38",
    image: "https://mentorandi.com/images/mentors/profiles/adrian-adhd-mentor.webp",
  },
  {
    name: "Celine",
    role: "Relationship Mentor",
    color: "#B0654F",
    image: "https://mentorandi.com/images/mentors/profiles/celine-relationship-mentor.webp",
  },
  {
    name: "Victor",
    role: "Stress & Burnout Mentor",
    color: "#A0637A",
    image: "https://mentorandi.com/images/mentors/profiles/victor-stress-burnout-mentor.webp",
  },
  {
    name: "Suzan",
    role: "Parenting Mentor",
    color: "#9A7B3A",
    image: "https://mentorandi.com/images/mentors/profiles/suzan-parenting-mentor.webp",
  },
  {
    name: "Leo",
    role: "Health & Fitness Mentor",
    color: "#8E6E52",
    image: "https://mentorandi.com/images/mentors/profiles/leo-health-fitness-mentor.webp",
  },
  {
    name: "Elias",
    role: "Focus Mentor",
    color: "#C56B47",
    image: "https://mentorandi.com/images/mentors/profiles/elias-focus-mentor.webp",
  },
  {
    name: "Joyce",
    role: "Charisma Mentor",
    color: "#B58A2E",
    image: "https://mentorandi.com/images/mentors/profiles/joyce-confidence-mentor.webp",
  },
];

const fade = (frame: number, duration: number) =>
  interpolate(
    frame,
    [0, 18, duration - 20, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

const rise = (frame: number, delay = 0, distance = 34) => {
  const p = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: {damping: 18, stiffness: 130, mass: 0.8},
  });
  return {
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
  };
};

const SceneShell: React.FC<{
  children: React.ReactNode;
  frame: number;
  duration: number;
  accent?: string;
}> = ({children, frame, duration, accent = C.terra}) => (
  <AbsoluteFill
    style={{
      background: C.paper,
      color: C.ink,
      opacity: fade(frame, duration),
      fontFamily: hanken,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        width: 760,
        height: 760,
        borderRadius: "50%",
        right: -260,
        top: -300,
        background: accent,
        opacity: 0.08,
        filter: "blur(10px)",
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 620,
        height: 620,
        borderRadius: "50%",
        left: -300,
        bottom: -330,
        background: C.mauve,
        opacity: 0.045,
      }}
    />
    {children}
  </AbsoluteFill>
);

const Eyebrow: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      fontFamily: spaceMono,
      fontSize: 20,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: C.terraDeep,
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);

const BigHeadline: React.FC<{
  children: React.ReactNode;
  maxWidth?: number;
  fontSize?: number;
}> = ({children, maxWidth = 1180, fontSize = 76}) => (
  <div
    style={{
      fontFamily: newsreader,
      fontSize,
      lineHeight: 1.04,
      letterSpacing: "-0.03em",
      fontWeight: 500,
      maxWidth,
    }}
  >
    {children}
  </div>
);

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 180;
  const second = interpolate(frame, [70, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell frame={frame} duration={duration}>
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 160,
          width: 1040,
          ...rise(frame, 8),
        }}
      >
        <Eyebrow>Investor overview</Eyebrow>
        <div style={{height: 28}} />
        <BigHeadline>
          AI is getting very good at{" "}
          <span style={{color: C.terraDeep}}>answers.</span>
        </BigHeadline>
        <div
          style={{
            marginTop: 30,
            fontSize: 34,
            lineHeight: 1.35,
            color: C.muted,
            maxWidth: 880,
          }}
        >
          But people rarely change because of a single answer.
        </div>
        <div
          style={{
            marginTop: 36,
            fontFamily: newsreader,
            fontSize: 64,
            lineHeight: 1.05,
            opacity: second,
            transform: `translateY(${(1 - second) * 24}px)`,
          }}
        >
          Growth needs <span style={{color: C.terraDeep}}>continuity.</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 120,
          top: 210,
          width: 440,
          height: 570,
        }}
      >
        {[0, 1, 2].map((i) => {
          const p = spring({
            frame: Math.max(0, frame - 18 - i * 12),
            fps: 30,
            config: {damping: 18, stiffness: 110},
          });
          const disappear = interpolate(frame, [90, 130], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 360,
                height: 138,
                right: i * 34,
                top: i * 118,
                background: C.raised,
                border: `1px solid ${C.line}`,
                borderRadius: 24,
                boxShadow: "0 18px 48px rgba(32,31,27,.08)",
                padding: 28,
                opacity: p * disappear,
                transform: `translateY(${(1 - p) * 28}px)`,
              }}
            >
              <div style={{fontFamily: spaceMono, fontSize: 15, color: C.faint}}>
                NEW CHAT
              </div>
              <div
                style={{
                  height: 12,
                  borderRadius: 8,
                  background: C.band,
                  marginTop: 22,
                  width: i === 1 ? "75%" : "88%",
                }}
              />
              <div
                style={{
                  height: 12,
                  borderRadius: 8,
                  background: C.band,
                  marginTop: 12,
                  width: i === 2 ? "56%" : "68%",
                }}
              />
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 200,
            right: 0,
            top: 220,
            borderRadius: 28,
            background: C.surface,
            border: `2px solid ${C.terra}`,
            padding: 30,
            boxShadow: "0 22px 60px rgba(32,31,27,.12)",
            opacity: second,
            transform: `scale(${0.92 + second * 0.08})`,
          }}
        >
          <div style={{fontFamily: spaceMono, color: C.terraDeep, fontSize: 15}}>
            CONTINUING RELATIONSHIP
          </div>
          <div style={{fontSize: 28, fontWeight: 600, marginTop: 22}}>
            Context carries forward.
          </div>
          <div style={{fontSize: 21, color: C.muted, marginTop: 14}}>
            Goals, patterns and prior conversations stay useful over time.
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const BrandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 240;
  const p = spring({
    frame: frame - 10,
    fps: 30,
    config: {damping: 20, stiffness: 100},
  });

  return (
    <SceneShell frame={frame} duration={duration}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Img
          src={LOGO}
          style={{
            width: 920,
            objectFit: "contain",
            opacity: p,
            transform: `scale(${0.92 + 0.08 * p})`,
          }}
        />
        <div
          style={{
            fontFamily: newsreader,
            fontSize: 62,
            marginTop: 68,
            letterSpacing: "-0.02em",
            ...rise(frame, 34),
          }}
        >
          The mentor who remembers you.
        </div>
        <div
          style={{
            fontSize: 27,
            color: C.muted,
            marginTop: 24,
            ...rise(frame, 50),
          }}
        >
          One persistent relationship. Specialist support when the need changes.
        </div>
      </div>
    </SceneShell>
  );
};

const MentorCard: React.FC<{
  mentor: (typeof mentors)[number];
  frame: number;
  index: number;
}> = ({mentor, frame, index}) => {
  const p = spring({
    frame: frame - 10 - index * 7,
    fps: 30,
    config: {damping: 17, stiffness: 120},
  });

  return (
    <div
      style={{
        width: 360,
        height: 330,
        background: C.surface,
        border: `1px solid ${mentor.color}55`,
        borderRadius: 26,
        overflow: "hidden",
        boxShadow: "0 12px 36px rgba(32,31,27,.07)",
        opacity: p,
        transform: `translateY(${(1 - p) * 36}px) scale(${0.96 + p * 0.04})`,
      }}
    >
      <div style={{height: 220, overflow: "hidden"}}>
        <Img
          src={mentor.image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 30%",
          }}
        />
      </div>
      <div style={{padding: "20px 24px"}}>
        <div style={{fontSize: 27, fontWeight: 700}}>{mentor.name}</div>
        <div
          style={{
            marginTop: 5,
            fontFamily: spaceMono,
            fontSize: 14,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: mentor.color,
            fontWeight: 700,
          }}
        >
          {mentor.role}
        </div>
      </div>
    </div>
  );
};

const MentorsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 360;

  return (
    <SceneShell frame={frame} duration={duration} accent={C.gold}>
      <div style={{position: "absolute", left: 120, top: 92, ...rise(frame, 0)}}>
        <Eyebrow>One relationship</Eyebrow>
        <div style={{height: 18}} />
        <BigHeadline fontSize={60}>
          Eight specialist mentors.
        </BigHeadline>
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 285,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}
      >
        {mentors.map((mentor, i) => (
          <MentorCard key={mentor.name} mentor={mentor} frame={frame} index={i} />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          bottom: 54,
          fontSize: 22,
          color: C.muted,
          ...rise(frame, 100),
        }}
      >
        Life · ADHD · Relationships · Stress · Parenting · Health & Fitness · Focus · Charisma
      </div>
    </SceneShell>
  );
};

const MessageBubble: React.FC<{
  side: "user" | "mentor";
  children: React.ReactNode;
  frame: number;
  delay: number;
  width?: number;
}> = ({side, children, frame, delay, width = 690}) => {
  const p = spring({
    frame: frame - delay,
    fps: 30,
    config: {damping: 20, stiffness: 120},
  });

  return (
    <div
      style={{
        alignSelf: side === "user" ? "flex-end" : "flex-start",
        width,
        padding: "23px 28px",
        borderRadius:
          side === "user" ? "22px 22px 6px 22px" : "22px 22px 22px 6px",
        background: side === "user" ? C.band : C.surface,
        border: `1px solid ${side === "user" ? "#D6C9B2" : C.line}`,
        fontSize: 23,
        lineHeight: 1.45,
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
      {children}
    </div>
  );
};

const ProductScene: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 480;
  const specialist = interpolate(frame, [250, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell frame={frame} duration={duration}>
      <div style={{position: "absolute", left: 110, top: 65, ...rise(frame, 0)}}>
        <Eyebrow>How it works</Eyebrow>
        <div style={{height: 12}} />
        <BigHeadline fontSize={54}>
          Context becomes part of the product.
        </BigHeadline>
      </div>

      <div
        style={{
          position: "absolute",
          left: 105,
          top: 210,
          width: 1180,
          height: 760,
          background: C.raised,
          border: `1px solid ${C.line}`,
          borderRadius: 28,
          boxShadow: "0 20px 55px rgba(32,31,27,.09)",
          padding: 34,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          ...rise(frame, 12),
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: 18}}>
          <Img
            src={specialist < 0.5 ? mentors[0].image : mentors[7].image}
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div>
            <div style={{fontSize: 29, fontWeight: 700}}>
              {specialist < 0.5 ? "Marcus" : "Joyce"}
            </div>
            <div
              style={{
                fontFamily: spaceMono,
                color: C.terraDeep,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {specialist < 0.5 ? "Life Mentor" : "Charisma Mentor"}
            </div>
          </div>
          <div style={{marginLeft: "auto", fontFamily: spaceMono, color: C.faint}}>
            4,820 CREDITS
          </div>
        </div>

        <div
          style={{
            height: 1,
            background: C.line,
            margin: "2px 0 8px",
          }}
        />

        <div style={{display: "flex", flexDirection: "column", gap: 18}}>
          <MessageBubble side="user" frame={frame} delay={25}>
            I keep putting off a difficult conversation at work.
          </MessageBubble>
          <MessageBubble side="mentor" frame={frame} delay={65}>
            Let's separate the decision from the fear. What's the outcome you actually want from the conversation?
          </MessageBubble>
          <MessageBubble side="user" frame={frame} delay={125}>
            I want to be clear without sounding aggressive.
          </MessageBubble>

          <div
            style={{
              opacity: specialist,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div
              style={{
                alignSelf: "center",
                fontFamily: spaceMono,
                fontSize: 14,
                color: C.terraDeep,
                letterSpacing: "0.08em",
                padding: "8px 14px",
                border: `1px solid ${C.line}`,
                borderRadius: 999,
                background: C.paper,
              }}
            >
              SPECIALIST CONTEXT AVAILABLE
            </div>
            <MessageBubble side="mentor" frame={frame} delay={290}>
              We already know the goal: clarity without aggression. Let's train the first 20 seconds so the opening sets the right tone.
            </MessageBubble>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 95,
          top: 250,
          width: 470,
          minHeight: 650,
          background: C.surface,
          border: `1px solid ${C.line}`,
          borderRadius: 24,
          padding: 30,
          boxShadow: "0 12px 36px rgba(32,31,27,.07)",
          ...rise(frame, 70),
        }}
      >
        <div style={{fontFamily: spaceMono, fontSize: 15, color: C.terraDeep}}>
          REMEMBERED CONTEXT
        </div>

        {[
          ["Work conflict", "Current situation"],
          ["Avoidance pattern", "Recurring pattern"],
          ["Speak clearly", "Goal"],
          ["Calm opening", "Preferred approach"],
        ].map(([title, label], i) => {
          const p = spring({
            frame: frame - 110 - i * 28,
            fps: 30,
            config: {damping: 18, stiffness: 100},
          });
          return (
            <div
              key={title}
              style={{
                marginTop: 24,
                padding: 22,
                background: C.raised,
                border: `1px solid ${C.line}`,
                borderRadius: 18,
                opacity: p,
                transform: `translateX(${(1 - p) * 24}px)`,
              }}
            >
              <div style={{fontSize: 23, fontWeight: 650}}>{title}</div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: spaceMono,
                  fontSize: 13,
                  color: C.faint,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: 30,
            paddingTop: 24,
            borderTop: `1px solid ${C.line}`,
            color: C.muted,
            fontSize: 20,
            lineHeight: 1.45,
          }}
        >
          The relationship continues even when the specialist changes.
        </div>
      </div>
    </SceneShell>
  );
};

const CompoundScene: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 420;
  const lineProgress = interpolate(frame, [50, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const items = [
    {x: 160, title: "Goals", sub: "What the user is trying to change"},
    {x: 520, title: "Patterns", sub: "What keeps repeating"},
    {x: 880, title: "Preferences", sub: "What kind of support works"},
    {x: 1240, title: "Progress", sub: "What has already been tried"},
    {x: 1600, title: "Continuity", sub: "The next conversation starts ahead"},
  ];

  return (
    <SceneShell frame={frame} duration={duration} accent={C.mauve}>
      <div style={{position: "absolute", left: 120, top: 105, ...rise(frame, 0)}}>
        <Eyebrow>Compounding context</Eyebrow>
        <div style={{height: 18}} />
        <BigHeadline fontSize={62}>
          Every conversation can make the next one more useful.
        </BigHeadline>
      </div>

      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          top: 510,
          height: 8,
          borderRadius: 99,
          background: C.line,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${lineProgress * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${C.terra}, ${C.mauve})`,
          }}
        />
      </div>

      {items.map((item, i) => {
        const p = spring({
          frame: frame - 45 - i * 38,
          fps: 30,
          config: {damping: 19, stiffness: 110},
        });
        return (
          <div
            key={item.title}
            style={{
              position: "absolute",
              left: item.x - 105,
              top: 445,
              width: 210,
              textAlign: "center",
              opacity: p,
              transform: `scale(${0.9 + p * 0.1})`,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                margin: "0 auto",
                borderRadius: "50%",
                background: i === items.length - 1 ? C.terraDeep : C.surface,
                border: `3px solid ${i === items.length - 1 ? C.terraDeep : C.terra}`,
                boxShadow: "0 0 0 10px rgba(188,91,56,.08)",
              }}
            />
            <div style={{fontSize: 26, fontWeight: 700, marginTop: 28}}>
              {item.title}
            </div>
            <div
              style={{
                fontSize: 18,
                color: C.muted,
                lineHeight: 1.35,
                marginTop: 10,
              }}
            >
              {item.sub}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 350,
          right: 350,
          bottom: 110,
          padding: 30,
          borderRadius: 22,
          background: C.surface,
          border: `1px solid ${C.line}`,
          textAlign: "center",
          fontFamily: newsreader,
          fontSize: 35,
          ...rise(frame, 245),
        }}
      >
        The product is not only the answer. It is the accumulated understanding.
      </div>
    </SceneShell>
  );
};

const ThesisCard: React.FC<{
  index: number;
  frame: number;
  title: string;
  body: string;
  accent: string;
}> = ({index, frame, title, body, accent}) => {
  const p = spring({
    frame: frame - 25 - index * 18,
    fps: 30,
    config: {damping: 18, stiffness: 100},
  });
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${accent}55`,
        borderRadius: 24,
        padding: 32,
        minHeight: 250,
        boxShadow: "0 12px 35px rgba(32,31,27,.06)",
        opacity: p,
        transform: `translateY(${(1 - p) * 28}px)`,
      }}
    >
      <div
        style={{
          fontFamily: spaceMono,
          fontSize: 14,
          letterSpacing: "0.08em",
          color: accent,
        }}
      >
        0{index + 1}
      </div>
      <div style={{fontSize: 30, fontWeight: 700, marginTop: 22}}>{title}</div>
      <div
        style={{
          fontSize: 21,
          color: C.muted,
          lineHeight: 1.48,
          marginTop: 16,
        }}
      >
        {body}
      </div>
    </div>
  );
};

const InvestorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 360;

  const cards = [
    {
      title: "Free entry",
      body: "Marcus creates a low-friction starting point before specialist access and paid plans.",
      accent: C.terra,
    },
    {
      title: "Specialist expansion",
      body: "The same account can grow into ADHD, relationships, stress, focus, health, parenting and charisma.",
      accent: C.gold,
    },
    {
      title: "Persistent context",
      body: "Value can accumulate because the relationship does not reset at every conversation.",
      accent: C.mauve,
    },
    {
      title: "Content distribution",
      body: "Evidence-led mentor articles create a repeatable acquisition surface beyond the app itself.",
      accent: C.olive,
    },
  ];

  return (
    <SceneShell frame={frame} duration={duration} accent={C.gold}>
      <div style={{position: "absolute", left: 120, top: 80, ...rise(frame, 0)}}>
        <Eyebrow>Investor thesis</Eyebrow>
        <div style={{height: 14}} />
        <BigHeadline fontSize={58}>
          A recurring relationship, not a one-off utility.
        </BigHeadline>
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 300,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}
      >
        {cards.map((card, i) => (
          <ThesisCard
            key={card.title}
            index={i}
            frame={frame}
            title={card.title}
            body={card.body}
            accent={card.accent}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          bottom: 90,
          display: "flex",
          justifyContent: "space-between",
          gap: 40,
          alignItems: "flex-end",
          ...rise(frame, 120),
        }}
      >
        <div style={{fontFamily: newsreader, fontSize: 40, maxWidth: 960}}>
          As foundation models improve, differentiation can move toward{" "}
          <span style={{color: C.terraDeep}}>
            context, specialization, trust and continuity.
          </span>
        </div>
        <div
          style={{
            fontFamily: spaceMono,
            fontSize: 16,
            color: C.faint,
            textAlign: "right",
            lineHeight: 1.6,
          }}
        >
          CONSUMER FIRST
          <br />
          SUBSCRIPTION + CREDITS
          <br />
          SPECIALIST MENTOR NETWORK
        </div>
      </div>
    </SceneShell>
  );
};

const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 300;
  const p = spring({
    frame: frame - 14,
    fps: 30,
    config: {damping: 20, stiffness: 90},
  });

  return (
    <SceneShell frame={frame} duration={duration}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Eyebrow>Persistent AI mentorship</Eyebrow>
        <Img
          src={LOGO}
          style={{
            width: 820,
            marginTop: 54,
            opacity: p,
            transform: `scale(${0.94 + 0.06 * p})`,
          }}
        />
        <div
          style={{
            fontFamily: newsreader,
            fontSize: 58,
            maxWidth: 1120,
            lineHeight: 1.08,
            marginTop: 62,
            ...rise(frame, 32),
          }}
        >
          A relationship that remembers.
          <br />
          Specialist support that grows with the user.
        </div>
        <div
          style={{
            marginTop: 48,
            fontFamily: spaceMono,
            fontSize: 20,
            letterSpacing: "0.12em",
            color: C.terraDeep,
            ...rise(frame, 55),
          }}
        >
          MENTORANDI.COM
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 42,
            fontSize: 16,
            color: C.faint,
          }}
        >
          Investor overview · Mentor AI Corp · 2026
        </div>
      </div>
    </SceneShell>
  );
};

export const InvestorFilm: React.FC = () => {
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Sequence from={0} durationInFrames={180}>
        <IntroScene />
      </Sequence>

      <Sequence from={180} durationInFrames={240}>
        <BrandScene />
      </Sequence>

      <Sequence from={420} durationInFrames={360}>
        <MentorsScene />
      </Sequence>

      <Sequence from={780} durationInFrames={480}>
        <ProductScene />
      </Sequence>

      <Sequence from={1260} durationInFrames={420}>
        <CompoundScene />
      </Sequence>

      <Sequence from={1680} durationInFrames={360}>
        <InvestorScene />
      </Sequence>

      <Sequence from={2040} durationInFrames={300}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};
