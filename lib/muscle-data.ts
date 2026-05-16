export type MuscleData = {
  id: string;
  name: string;
  group: string;
  description: string;
  exercises: string[];
  tips: string;
  sets: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
};

export const MUSCLE_DATABASE: Record<string, MuscleData> = {
  chest: {
    id: 'chest',
    name: 'Chest',
    group: 'Upper Body',
    description: 'Your main pushing muscle. It powers bench press, push-ups, and any movement where you push something away from your body.',
    exercises: ['Bench Press', 'Push-ups', 'Cable Flyes', 'Dumbbell Flyes'],
    tips: 'Focus on controlled lowering. Pull your shoulder blades back and down on presses to protect your shoulders and feel it more in the chest.',
    sets: '3-4 sets × 8-12 reps',
    difficulty: 'Beginner',
  },
  shoulders: {
    id: 'shoulders',
    name: 'Shoulders',
    group: 'Upper Body',
    description: 'Three-headed muscle that caps the top of your arms. Responsible for overhead pressing, raising your arms out to the sides, and overall upper body width.',
    exercises: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Face Pulls'],
    tips: 'Train all three heads equally. Don\'t ego-lift on lateral raises — light weight with strict form beats heavy swinging every time.',
    sets: '3-4 sets × 10-15 reps',
    difficulty: 'Intermediate',
  },
  biceps: {
    id: 'biceps',
    name: 'Biceps',
    group: 'Arms',
    description: 'The "show muscle" on the front of your upper arm. Responsible for curling and pulling movements. Everyone\'s favorite muscle to train.',
    exercises: ['Barbell Curls', 'Hammer Curls', 'Chin-ups', 'Incline Dumbbell Curls'],
    tips: 'Keep your elbows pinned to your sides — no swinging. Squeeze hard at the top and lower slowly. Quality over quantity.',
    sets: '3 sets × 10-12 reps',
    difficulty: 'Beginner',
  },
  triceps: {
    id: 'triceps',
    name: 'Triceps',
    group: 'Arms',
    description: 'The horseshoe-shaped muscle on the back of your upper arm. Makes up about 2/3 of your arm size — if you want big arms, train these.',
    exercises: ['Tricep Pushdowns', 'Skull Crushers', 'Dips', 'Overhead Extensions'],
    tips: 'Overhead movements hit the long head best. Lock out fully at the top for maximum contraction. Don\'t flare your elbows.',
    sets: '3-4 sets × 10-12 reps',
    difficulty: 'Beginner',
  },
  abs: {
    id: 'abs',
    name: 'Abs',
    group: 'Core',
    description: 'Your six-pack muscles running down the front of your stomach. Essential for core stability, posture, and looking good at the beach.',
    exercises: ['Crunches', 'Leg Raises', 'Planks', 'Cable Crunches'],
    tips: 'Abs are made in the gym but revealed in the kitchen. Train them with progressive overload like any other muscle. Focus on the squeeze.',
    sets: '3 sets × 15-20 reps',
    difficulty: 'Beginner',
  },
  quads: {
    id: 'quads',
    name: 'Quads',
    group: 'Legs',
    description: 'The big muscles on the front of your thighs. The strongest muscle group in your body — responsible for squatting, jumping, and running.',
    exercises: ['Squats', 'Leg Press', 'Lunges', 'Leg Extensions'],
    tips: 'Go deep on squats — at least parallel. Keep your knees tracking over your toes. Never skip leg day.',
    sets: '4 sets × 8-12 reps',
    difficulty: 'Intermediate',
  },
  hamstrings: {
    id: 'hamstrings',
    name: 'Hamstrings',
    group: 'Legs',
    description: 'The muscles on the back of your thighs. Key for sprinting, deadlifting, and knee health. Most people undertrain these.',
    exercises: ['Romanian Deadlifts', 'Leg Curls', 'Nordic Curls', 'Good Mornings'],
    tips: 'Stretch under load with RDLs for maximum growth. Keep a slight bend in your knees during hip hinge movements. Go slow on the negative.',
    sets: '3-4 sets × 10-12 reps',
    difficulty: 'Intermediate',
  },
  back: {
    id: 'back',
    name: 'Back',
    group: 'Upper Body',
    description: 'The large V-shaped muscles that give you a wide back. Essential for pulling, posture, and looking jacked from behind.',
    exercises: ['Pull-ups', 'Barbell Rows', 'Lat Pulldowns', 'Seated Cable Rows'],
    tips: 'Pull with your elbows, not your hands. Squeeze your shoulder blades together at the top. Mind-muscle connection is everything here.',
    sets: '4 sets × 8-12 reps',
    difficulty: 'Intermediate',
  },
  glutes: {
    id: 'glutes',
    name: 'Glutes',
    group: 'Legs',
    description: 'The biggest muscle in your body — your butt. Powers sprinting, jumping, squatting, and basically every athletic movement.',
    exercises: ['Hip Thrusts', 'Squats', 'Bulgarian Split Squats', 'Glute Bridges'],
    tips: 'Squeeze hard at full lockout. Pause at the top of hip thrusts. If you can\'t feel them working, go lighter and focus on the squeeze.',
    sets: '3-4 sets × 10-15 reps',
    difficulty: 'Beginner',
  },
  calves: {
    id: 'calves',
    name: 'Calves',
    group: 'Legs',
    description: 'The diamond-shaped muscles at the back of your lower leg. Stubborn to grow but critical for explosiveness and ankle stability.',
    exercises: ['Calf Raises', 'Jump Rope', 'Seated Calf Raises', 'Box Jumps'],
    tips: 'Full range of motion is key — stretch deep at the bottom, pause and squeeze hard at the top. Train them frequently, they recover fast.',
    sets: '4 sets × 15-20 reps',
    difficulty: 'Beginner',
  },
};
