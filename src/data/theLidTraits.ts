// THE LID — 9 attributes (Profiler concept doc section 5 / THE_LID slider
// spec). One reusable slider component (src/components/TheLidSlider.tsx)
// reads this; nothing here is hard-coded per-attribute in a component.
//
// Endpoints (1 and 5) are the approved copy baked into the reference art
// (assets/noir/profiler/lid_bg.jpg) for each row — reproduced here as real
// text since the spec is explicit that this description is NOT part of the
// background image, it's dynamic text the code renders. Values 2-4 are a
// first pass in the same voice, filling the obvious middle of an
// already-approved 5-point joke scale — flag anything that should read
// differently.

export type LidTraitId =
  | 'romantic'
  | 'caring'
  | 'honest'
  | 'consistency'
  | 'initiative'
  | 'humor'
  | 'mystery'
  | 'drama'
  | 'repeat';

export type LidTrait = {
  id: LidTraitId;
  label: string;
  descriptions: Record<1 | 2 | 3 | 4 | 5, string>;
};

export const LID_TRAITS: LidTrait[] = [
  {
    id: 'romantic',
    label: 'ROMANTIC',
    descriptions: {
      1: 'Flowers? Seriously?',
      2: 'Occasional effort detected.',
      3: 'Standard human behaviour.',
      4: "Knows what he's doing.",
      5: 'Nicholas Sparks is concerned.',
    },
  },
  {
    id: 'caring',
    label: 'CARING',
    descriptions: {
      1: "You're on your own.",
      2: 'Notices, eventually.',
      3: 'Shows up when it counts.',
      4: 'Checks in unprompted.',
      5: 'Already on his way.',
    },
  },
  {
    id: 'honest',
    label: 'HONEST',
    descriptions: {
      1: 'Corporate spokesperson.',
      2: 'Answers vary by mood.',
      3: 'Tells the truth, eventually.',
      4: 'Sometimes too blunt.',
      5: 'Painfully honest.',
    },
  },
  {
    id: 'consistency',
    label: 'CONSISTENT',
    descriptions: {
      1: 'Plans are theoretical.',
      2: 'Shows up most of the time.',
      3: 'Reliable, with exceptions.',
      4: 'Rarely cancels.',
      5: 'Says it. Does it.',
    },
  },
  {
    id: 'initiative',
    label: 'INITIATIVE',
    descriptions: {
      1: 'Waiting for instructions.',
      2: 'Needs a nudge.',
      3: 'Sometimes takes charge.',
      4: 'Rarely waits around.',
      5: 'Already made a plan.',
    },
  },
  {
    id: 'humor',
    label: 'HUMOR',
    descriptions: {
      1: 'Please stop.',
      2: 'Occasionally lands one.',
      3: 'Reliably amusing.',
      4: 'Dangerously quick-witted.',
      5: 'Unfortunately hilarious.',
    },
  },
  {
    id: 'mystery',
    label: 'MYSTERY',
    descriptions: {
      1: 'Nothing to investigate.',
      2: 'A few unexplained gaps.',
      3: 'Keeps things to himself.',
      4: 'The file has redactions.',
      5: 'FBI would like a word.',
    },
  },
  {
    id: 'drama',
    label: 'DRAMA POTENTIAL',
    descriptions: {
      1: 'Peaceful wildlife.',
      2: 'Occasional weather.',
      3: 'Manageable turbulence.',
      4: 'Reliable plot twists.',
      5: 'Season finale.',
    },
  },
  {
    id: 'repeat',
    label: 'WOULD YOU DO IT AGAIN?',
    descriptions: {
      1: 'Absolutely not.',
      2: 'Would need convincing.',
      3: 'Probably, with conditions.',
      4: 'Yes, minimal hesitation.',
      5: 'Unfortunately, yes.',
    },
  },
];

export const LID_DEFAULT_VALUE = 3;
