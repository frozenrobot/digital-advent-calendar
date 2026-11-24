/* ============================================================
   ✏️  THIS IS THE ONLY FILE YOU NEED TO EDIT
   ------------------------------------------------------------
   Each day can have:
     emoji     – what peeks out from behind the opened door
     title     – heading in the pop-up
     message   – the text (line breaks are kept)
     image     – optional photo, e.g. "photos/day3.jpg"
     link      – optional URL (a song, playlist, video, booking…)
     linkLabel – text for the link button
     coupon    – set to true to style the message as a tear-off voucher
   Everything in [square brackets] is a placeholder for you to fill in.
   ============================================================ */

window.CALENDAR = {
  config: {
    year: 2026,                 // the December this calendar is for
    recipient: "my love",       // shown on the gift tag + header
    from: "Khanak",             // shown on the gift tag
    title: "24 Little Windows & One Big One",
    // Optional: put an mp3 in this folder and name it here to use it
    // instead of the built-in music box, e.g. "our-song.mp3"
    musicFile: ""
  },

  days: {
    1: {
      emoji: "💌",
      title: "Welcome to your advent calendar",
      message: "Every day until Christmas there's a tiny something waiting for you here.\n\nNo peeking ahead. (I'll know.)\n\nDay one is simple: I love you."
    },
    2: {
      emoji: "📸",
      title: "A favourite photo of us",
      message: "[Why you love this photo — where you were, what happened right before or after it was taken.]",
      image: ""
    },
    3: {
      emoji: "🎟️",
      title: "Coupon: one hot chocolate date",
      message: "Good for one hot chocolate, made or bought by me, with extra marshmallows.\nRedeemable any evening this month.",
      coupon: true
    },
    4: {
      emoji: "🎶",
      title: "A song that makes me think of you",
      message: "[The song, and the memory attached to it.]",
      link: "",
      linkLabel: "Listen"
    },
    5: {
      emoji: "🧠",
      title: "Pop quiz",
      message: "Where did we have our very first date, and what did I order?\n\nText me your answer. Correct answers win a kiss. Wrong answers also win a kiss, but with a sigh."
    },
    6: {
      emoji: "🥾",
      title: "Check your shoe",
      message: "Happy St. Nicholas Day! Something small is hiding in [location in the house]. Go look."
    },
    7: {
      emoji: "✨",
      title: "Reasons I love you, part one",
      message: "1. [The way you …]\n2. [How you always …]\n3. [That one face you make when …]"
    },
    8: {
      emoji: "🎬",
      title: "Coupon: movie night, your pick",
      message: "You choose the film. I bring the snacks and promise not to comment on the plot.\nYes, even if it's [that movie] again.",
      coupon: true
    },
    9: {
      emoji: "😂",
      title: "Remember this?",
      message: "[An inside joke or a funny story only the two of you understand.]"
    },
    10: {
      emoji: "🗺️",
      title: "A tiny treasure hunt",
      message: "Clue: I'm cold, I hum all night, and I'm where the leftovers live.\n\n[Hide a note or a treat there, with the next clue if you like.]"
    },
    11: {
      emoji: "📖",
      title: "The moment I knew",
      message: "[The story of when you realised you were falling for him.]"
    },
    12: {
      emoji: "💆",
      title: "Coupon: one long massage",
      message: "Thirty uninterrupted minutes. No phone in my hand, no complaints.",
      coupon: true
    },
    13: {
      emoji: "🎧",
      title: "A playlist for you",
      message: "I made you a mixtape, the modern way. Press play on your way to work.",
      link: "",
      linkLabel: "Open the playlist"
    },
    14: {
      emoji: "🍪",
      title: "Today's mission: bake something",
      message: "Tonight we're making [cookies / his favourite dessert]. I already bought the ingredients. You're on mixing duty."
    },
    15: {
      emoji: "🖼️",
      title: "Throwback",
      message: "[An old photo — the earliest one of you two, or a baby photo of each of you side by side.]",
      image: ""
    },
    16: {
      emoji: "✨",
      title: "Reasons I love you, part two",
      message: "4. [Something he does without noticing]\n5. [Something he taught you]\n6. [Something about how he treats other people]"
    },
    17: {
      emoji: "🎥",
      title: "A little message from me",
      message: "I recorded something for you. Headphones recommended.",
      link: "",
      linkLabel: "Watch"
    },
    18: {
      emoji: "🍳",
      title: "Coupon: breakfast in bed",
      message: "One lazy morning, your order taken the night before, delivered on a tray.",
      coupon: true
    },
    19: {
      emoji: "🌟",
      title: "Things I can't wait to do with you",
      message: "• [A trip you've been talking about]\n• [Something small and ordinary]\n• [Something for next year]"
    },
    20: {
      emoji: "🚗",
      title: "Tonight: Christmas lights drive",
      message: "Wear something warm. I'll bring a flask and the playlist. We're going to find the most over-the-top house in town."
    },
    21: {
      emoji: "🌙",
      title: "The longest night of the year",
      message: "Which means the most hours to spend curled up next to you.\n\n[A poem, a quote, or a few lines you wrote yourself.]"
    },
    22: {
      emoji: "🃏",
      title: "Coupon: one free pass",
      message: "Valid for getting out of one chore, winning one argument, or picking the restaurant. Choose wisely.",
      coupon: true
    },
    23: {
      emoji: "💭",
      title: "My favourite memory of this year",
      message: "[The moment from this year you'd relive with him if you could.]",
      image: ""
    },
    24: {
      emoji: "🕯️",
      title: "Christmas Eve",
      message: "One more sleep.\n\nThere's a present under the tree with a gold ribbon. You may open that one tonight."
    },
    25: {
      emoji: "🎁",
      title: "Merry Christmas, my love",
      message: "[Your big letter goes here — what this year with him has meant, and what you're hoping for in the next.]\n\n[And the big reveal: a trip, tickets, or where the real present is hidden.]",
      image: "",
      link: "",
      linkLabel: "Your present"
    }
  }
};
