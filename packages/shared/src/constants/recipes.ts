import type { Goal } from '../schemas/user'

export interface Recipe {
  id: string
  name: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  goal_tags: Goal[]
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  description: string
}

export const RECIPES: Recipe[] = [
  // --- Breakfast ---
  {
    id: 'b1',
    name: 'Greek Yogurt & Berries',
    mealType: 'breakfast',
    goal_tags: ['cut', 'maintain'],
    calories: 250,
    protein_g: 20,
    carbs_g: 30,
    fat_g: 5,
    description: 'Non-fat Greek yogurt with mixed berries and a drizzle of honey.',
  },
  {
    id: 'b2',
    name: 'Oatmeal Power Bowl',
    mealType: 'breakfast',
    goal_tags: ['bulk', 'maintain'],
    calories: 450,
    protein_g: 18,
    carbs_g: 65,
    fat_g: 12,
    description: 'Rolled oats with banana, peanut butter, and chia seeds.',
  },
  {
    id: 'b3',
    name: 'Egg White Veggie Scramble',
    mealType: 'breakfast',
    goal_tags: ['cut'],
    calories: 200,
    protein_g: 24,
    carbs_g: 8,
    fat_g: 6,
    description: 'Egg whites scrambled with spinach, peppers, and onions.',
  },
  {
    id: 'b4',
    name: 'Protein Pancakes',
    mealType: 'breakfast',
    goal_tags: ['bulk', 'maintain'],
    calories: 500,
    protein_g: 35,
    carbs_g: 55,
    fat_g: 14,
    description: 'Oat and whey pancakes topped with maple syrup and blueberries.',
  },

  // --- Lunch ---
  {
    id: 'l1',
    name: 'Grilled Chicken Salad',
    mealType: 'lunch',
    goal_tags: ['cut', 'maintain'],
    calories: 350,
    protein_g: 38,
    carbs_g: 15,
    fat_g: 14,
    description: 'Grilled chicken breast over mixed greens with olive oil dressing.',
  },
  {
    id: 'l2',
    name: 'Turkey & Avocado Wrap',
    mealType: 'lunch',
    goal_tags: ['maintain', 'bulk'],
    calories: 520,
    protein_g: 32,
    carbs_g: 45,
    fat_g: 22,
    description: 'Whole wheat wrap with sliced turkey, avocado, and cheese.',
  },
  {
    id: 'l3',
    name: 'Tuna Rice Bowl',
    mealType: 'lunch',
    goal_tags: ['cut', 'maintain'],
    calories: 380,
    protein_g: 35,
    carbs_g: 42,
    fat_g: 6,
    description: 'Canned tuna on white rice with soy sauce and cucumber.',
  },
  {
    id: 'l4',
    name: 'Pasta & Meat Sauce',
    mealType: 'lunch',
    goal_tags: ['bulk'],
    calories: 650,
    protein_g: 35,
    carbs_g: 75,
    fat_g: 20,
    description: 'Whole grain pasta with lean ground beef tomato sauce.',
  },

  // --- Dinner ---
  {
    id: 'd1',
    name: 'Salmon & Sweet Potato',
    mealType: 'dinner',
    goal_tags: ['maintain', 'bulk'],
    calories: 550,
    protein_g: 40,
    carbs_g: 45,
    fat_g: 20,
    description: 'Baked salmon fillet with roasted sweet potato and broccoli.',
  },
  {
    id: 'd2',
    name: 'Chicken Stir-Fry',
    mealType: 'dinner',
    goal_tags: ['cut', 'maintain'],
    calories: 400,
    protein_g: 36,
    carbs_g: 30,
    fat_g: 14,
    description: 'Chicken breast stir-fried with vegetables and low-sodium soy sauce.',
  },
  {
    id: 'd3',
    name: 'Lean Beef & Rice',
    mealType: 'dinner',
    goal_tags: ['bulk'],
    calories: 600,
    protein_g: 42,
    carbs_g: 60,
    fat_g: 18,
    description: 'Grilled lean steak with jasmine rice and steamed vegetables.',
  },
  {
    id: 'd4',
    name: 'Shrimp Zucchini Noodles',
    mealType: 'dinner',
    goal_tags: ['cut'],
    calories: 280,
    protein_g: 30,
    carbs_g: 12,
    fat_g: 10,
    description: 'Sauteed shrimp over spiralized zucchini with garlic and olive oil.',
  },

  // --- Snacks ---
  {
    id: 's1',
    name: 'Protein Shake',
    mealType: 'snack',
    goal_tags: ['cut', 'maintain', 'bulk'],
    calories: 200,
    protein_g: 30,
    carbs_g: 10,
    fat_g: 3,
    description: 'One scoop whey protein with water or almond milk.',
  },
  {
    id: 's2',
    name: 'Trail Mix',
    mealType: 'snack',
    goal_tags: ['bulk', 'maintain'],
    calories: 350,
    protein_g: 10,
    carbs_g: 30,
    fat_g: 22,
    description: 'Mixed nuts, dried fruit, and dark chocolate chips.',
  },
  {
    id: 's3',
    name: 'Rice Cakes & PB',
    mealType: 'snack',
    goal_tags: ['bulk', 'maintain'],
    calories: 280,
    protein_g: 8,
    carbs_g: 35,
    fat_g: 12,
    description: 'Two rice cakes topped with peanut butter and banana slices.',
  },
  {
    id: 's4',
    name: 'Cottage Cheese & Pineapple',
    mealType: 'snack',
    goal_tags: ['cut', 'maintain'],
    calories: 180,
    protein_g: 22,
    carbs_g: 18,
    fat_g: 2,
    description: 'Low-fat cottage cheese with pineapple chunks.',
  },
]
