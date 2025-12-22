FR-001: Hmm...14 rounds sounds like way too much. How do we balance this better without compromising the underlying validity/message? What do you think about `1 Round == 1 Week` ? Or should a round line up with 'payday' (`1 Round == 2 Weeks`)

FR-002: That's right! Here's some additional notes on Blue Ball System (BBS)

- I envision the work chunks coming from an adjacent room with a solid roof to showcase the 'invisible' aspect. But it's only not visible to red, so to accomodate different scenarios, visibility should be a togglable value. This sort of flexibility should be a cornerstone help throughout the design and development (meters and guages modular and individually customizable/togglable, almost everything exposed as a variable as opposed to hardcoded, etc)

- The work-chunk split is supposed to represent the discrete tasks a "day's work" gets divided into. This should be random and somewhat arbitrary - but the amount of effort (measured in time) each sub-chunk takes varies wildly and is also arbitrary, but distributed in a log^e where it's not as common to get a chunk that unexpectedly take 2 weeks to finish but it can and will happen.

- In addition to surprising by taking an inordinate amount of time, some chunks, when complete, split into N more arbitrarily sized chunks where N is 2..5

- Failure to complete all the chunks in a day won't affect employment right away - instead, repeated mishaps reduce "rapport" with your employer, which is represented by an ambiguous gauge (like a frownie face/happy face) - this is to showcase the mystery of never truly knowing how close you are to being canned - adding to the stress. When you're fired, it will happen before you know it's going to happen as opposed to "a guage running out" at a deterministic time.

FR-003: Yup! The red splotches should spawn very slowly and at a fairly consistent rate. This is to simulate the routine aspect of Red tasks (dinner is scheduled, kid schedules are hectic, but known in advance. Kids make messes, but for the most part in predictable ways.).

FR-004: Red Ball has high stress potential, but zero real consequences.

- When it's time to go to sleep, red can choose to sleep, even if mess is still there. Red can continue to clean another time with the only penalty being increased stress.
- When Red is stressed, red has the option to request help from blue, but when blue ball is stressed, his stress can only increase

Q1. There is no victory or game over - only prolonged pain and misery - to simulate life. There is no break. or do-overs. Need some way to visually get this across (maybe ball avatar in top-left/right corner can weep as long as the stress meter is filled.) Every 30-seconds (or some interval) the game pauses and a cute modal pops up with a small loop-animation demonstrating one of the hundred things Red can do to relieve Blue's sadness and anguish. These should be simple "duh" things that any empath would do on instinct, but a non-empath doesn't even register it as a option let alone decide to follow through with it (a hug, for instance, will lower blue's stress significantly. Any random act of kindness, love, appreciation, etc..)

Q2. Red can refuse to do tasks

- Refusing tasks is more likely as red's stress levels are raised.
- Red will also ask Blue for help more when stress levels are raised.
- If stress level remain raised for a notable amount of time, it should somehow negatively affect blue more and more (even if blue's stress is already maxxed) - perhaps with handicaps - like all tasks take 30% longer. Instead of guages, these could appear, like debuffs

Q3. To simulate how you can only do one task at a time, it should be a button hold, instead of a press.

- While you hold the button, a visual cue of something being filled, and a rising audio cue, culminate in a satisfying 'ding' note or something to indicate reward and completion.
- There should be a harsh penalty for switching context from a blue task to a red task, to simulate real life context switching and how it takes 20 minutes to get back in the zone. Maybe the task bucket for the work chunk you were whittling away grows back as you leave it unattended to work on red's task.
- Blue can ignore red's requests - at his own peril! This will increase red's stress and cause red to request blue more often until maxxed and then debuffs are placed on blue.
- Of course, ignoring blue tasks will result in lower rapport until ultimately no more money comes in.
- Oh and just to be more realistic, the $6250 per round isn't enough to pay ALL expenses, but that's invisible too - all red knows is that every round we get money and can buy food and pay for our house - and is blissfully unaware of how close we are from not having money for food.

> Note: VERY important to show, after the point is driven home (a few rounds) - we have to simulate Red wanted to "get a job". This job brings in $400 every round, but cuts the amount of time blue can work almost in half. Now, already stressed, blue now has to pick up red's slack since red is gone 8 hours per day every other day. Red's tasks still pile up and Blue has to manage his tasks and red's or face debuffs, and peril.

Q4. It's many scenarios that should be easily scriptable. It's more a gentle and interesting way to show blue's point of view through clever gameplay to a dismissive avoidant red who shuts down or gets instantly triggered at any mention of blue's stress, or distress, or worries. It should take every opportunity possible to educate gently, in a non-triggering way, with short pauses filled with cute animated "tutorial" or "tip" modals.

Q5. It shouldn't exactly reveal it. At least, i'm not ready to think about that yet. Maybe the $6250 is a cheeky way to "reveal" as it'd be pretty obvious by then.

- Summary screens are a great opportunity for clever exposition. Play with this a lot. It's our canvas.

Q6. Yup, 3d physics-based.

- Ball can meander, drawn by a light gravity toward the current active mouse-click tasks coordinate.
- Fixed isometric - link you'd see in a typical pinball game. Smooth panning, at MOST
- NOT thinking two player - as least not yet. You choose to play as red or blue. Computer player uses naive deterministic strategy. Clicks his tasks. When asked for help, does it. etc.
