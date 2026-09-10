// Stołówka: ported from prison-life's CanteenView/canteenMeals. Not part of
// the Sklep/Czarny Rynek offer-rotation system - no rotation, everything is
// always available, and eating grants a temporary stat boost (handled by
// GameState.eatMeal/foodStatBonuses) rather than a permanent upgrade.

export const MEAL_BUFF_DURATION_MS = 10 * 60 * 1000;

export type MealEffectCategory = 'energia' | 'kondycja' | 'morale' | 'zdrowie';

export const mealEffectStatKey: Record<MealEffectCategory, string> = {
  energia: 'strength',
  kondycja: 'endurance',
  morale: 'luck',
  zdrowie: 'health',
};

export const mealEffectLegend: Array<{ id: MealEffectCategory; label: string; description: string }> = [
  { id: 'energia', label: 'Energia', description: 'Regeneruje siły.' },
  { id: 'kondycja', label: 'Kondycja', description: 'Wspiera trening.' },
  { id: 'morale', label: 'Morale', description: 'Poprawia nastrój.' },
  { id: 'zdrowie', label: 'Zdrowie', description: 'Pomaga w regeneracji.' },
];

export type Meal = { id: string; name: string; description: string; price: number; effect: MealEffectCategory; amount: number };

export const canteenMeals: Meal[] = [
  { id: 'oatmeal', name: 'Owsianka', description: 'Lekka, ale syca.', price: 30, effect: 'zdrowie', amount: 4 },
  { id: 'vegetable-soup', name: 'Zupa warzywna', description: 'Klasyka więziennej stołówki.', price: 25, effect: 'zdrowie', amount: 5 },
  { id: 'meat-cutlet', name: 'Kotlet mielony', description: 'Prosto i konkretnie.', price: 50, effect: 'energia', amount: 8 },
  { id: 'pasta', name: 'Makaron z sosem', description: 'Daje energię na dłużej.', price: 45, effect: 'kondycja', amount: 7 },
  { id: 'sandwich', name: 'Kanapka', description: 'Szybki posiłek.', price: 20, effect: 'zdrowie', amount: 3 },
  { id: 'salad', name: 'Sałatka', description: 'Coś lżejszego.', price: 35, effect: 'morale', amount: 5 },
  { id: 'boiled-eggs', name: 'Jajka na twardo', description: 'Źródło białka.', price: 25, effect: 'energia', amount: 5 },
  { id: 'canteen-protein-bar', name: 'Baton proteinowy', description: 'Dla tych, co trenują.', price: 40, effect: 'kondycja', amount: 6 },
  { id: 'canteen-coffee', name: 'Kawa', description: 'Mała przyjemność.', price: 15, effect: 'morale', amount: 4 },
];
