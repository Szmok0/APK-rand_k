// Evidence Archive card thumbnails — used ONLY as a fallback when the
// activity itself has no user-uploaded photo (a real photo always wins,
// see thumbnailFor() in app/(tabs)/evidence.tsx). Covers every glyph whose
// category is MEETINGS or OBJECTS (the ones a literal photo makes sense
// for, per the redesign discussion) — 29 distinct photos, 3 of them shared
// across a visually-similar pair (Museum/Exhibition, Party/Celebration,
// Errands/Chores) to cut the shoot list down without losing specificity
// anywhere it mattered. CONTACT/DATING/EMOTION-category glyphs (Message,
// Swipe, Argument, Kiss, Red Flag...) have no type photo — those exhibits
// fall back to an enlarged glyph icon instead.
export const TYPE_PHOTOS: Record<string, any> = {
  coffee: require('../../assets/glyphs/type_photos/coffee.jpg'),
  dinner: require('../../assets/glyphs/type_photos/dinner.jpg'),
  drink: require('../../assets/glyphs/type_photos/drink.jpg'),
  walk: require('../../assets/glyphs/type_photos/walk.jpg'),
  picnic: require('../../assets/glyphs/type_photos/picnic.jpg'),
  cinema: require('../../assets/glyphs/type_photos/cinema.jpg'),
  concert: require('../../assets/glyphs/type_photos/concert.jpg'),
  trip: require('../../assets/glyphs/type_photos/trip.jpg'),
  night: require('../../assets/glyphs/type_photos/night.jpg'),
  gift: require('../../assets/glyphs/type_photos/gift.jpg'),
  flowers: require('../../assets/glyphs/type_photos/flowers.jpg'),
  surprise: require('../../assets/glyphs/type_photos/surprise.jpg'),
  watching: require('../../assets/glyphs/type_photos/watching.jpg'),
  game_night: require('../../assets/glyphs/type_photos/game_night.jpg'),
  reading: require('../../assets/glyphs/type_photos/reading.jpg'),
  museum: require('../../assets/glyphs/type_photos/museum.jpg'),
  exhibition: require('../../assets/glyphs/type_photos/museum.jpg'), // shared
  theatre: require('../../assets/glyphs/type_photos/theatre.jpg'),
  karaoke: require('../../assets/glyphs/type_photos/karaoke.jpg'),
  dance: require('../../assets/glyphs/type_photos/dance.jpg'),
  creative_diy: require('../../assets/glyphs/type_photos/creative_diy.jpg'),
  hike: require('../../assets/glyphs/type_photos/hike.jpg'),
  bike: require('../../assets/glyphs/type_photos/bike.jpg'),
  swimming: require('../../assets/glyphs/type_photos/swimming.jpg'),
  sport: require('../../assets/glyphs/type_photos/sport.jpg'),
  beach: require('../../assets/glyphs/type_photos/beach.jpg'),
  stargazing: require('../../assets/glyphs/type_photos/stargazing.jpg'),
  party: require('../../assets/glyphs/type_photos/party.jpg'),
  celebration: require('../../assets/glyphs/type_photos/party.jpg'), // shared
  birthday: require('../../assets/glyphs/type_photos/birthday.jpg'),
  family_event: require('../../assets/glyphs/type_photos/family_event.jpg'),
  friends: require('../../assets/glyphs/type_photos/friends.jpg'),
  shopping: require('../../assets/glyphs/type_photos/shopping.jpg'),
  errands: require('../../assets/glyphs/type_photos/errands.jpg'),
  chores: require('../../assets/glyphs/type_photos/errands.jpg'), // shared
};
