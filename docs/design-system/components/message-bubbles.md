# Message bubbles

The conversation pattern behind a connection chat: your messages sit right in a
spruce tint, theirs sit left in parchment, each corner tucked toward its sender.
Implemented inline in `src/app/connections/components/ConnectionChat.tsx`.

![A two-message connection chat on a parchment card. A rounded "TUESDAY" day divider sits at the top. Below it, an incoming message in a parchment bubble reads "Tansi Marie! Thanks for accepting. I'd love to hear about the youth beading circle you mentioned," with the meta line "David · 2:14 pm" beneath it. Below and to the right, an outgoing message in a soft spruce-green bubble reads "Happy to! We meet Thursday evenings at the Friendship Centre. Would a call this weekend work to talk more?" with the meta line "You · 2:31 pm · Read."](../images/message-bubbles.png)

## Overview

A connection chat is the first real conversation between two matched people, so
the bubbles are calm rather than app-loud: generous radius, quiet borders, and
only two colours. **Your** messages align right in a spruce-100 bubble; **their**
messages align left in parchment, led by the sender’s [avatar](avatar.md). Each
bubble’s corner nearest its sender is tightened, giving a subtle tail without a
drawn pointer. A day divider separates conversations across dates, and a small
meta line under each bubble carries the sender, time, and — for your own
messages — whether it has been read.

This is a **pattern**, not a packaged component: it lives in the chat screen’s
markup. Match these values when building anything conversational rather than
re-inventing bubble styling.

## Anatomy

| Part | Rendering |
| --- | --- |
| Bubble (shared) | `rounded-2xl` (16px), 1px border, `px-4 py-2.5`, 15.5px text, max width 72% of the column |
| Mine | `bg-spruce-100` fill, `border-spruce-200`, aligned right; bottom-right corner tightened to `rounded-md` (6px) |
| Theirs | `bg-parchment` fill, `border-border`, aligned left; bottom-left corner tightened to `rounded-md` |
| Their avatar | Small [avatar](avatar.md) with initials, to the left of the first bubble |
| Day divider | A centred, pill-shaped uppercase date label (e.g. `TUESDAY`) between days |
| Meta line | `ink-faint`, 12px, under the bubble: sender · time, plus a read receipt on your own messages |

The tightened corner is what sides the bubble: bottom-right for you, bottom-left
for them. Everything else — radius, padding, type size — is identical, so the two
speakers read as equals in the same conversation.

## Read receipts

On your own messages the meta line ends with a delivery state. In the running
chat this is an icon: a single check (`Check`, delivered) that becomes a double
check (`CheckCheck`, read once `read_at` is set). The specimen spells the read
state as the word “Read” for clarity; either reads as the same status.

> **Grounding note.** The live `ConnectionChat` renders the meta line as the
> timestamp plus the check / double-check icon, and does not currently print the
> sender’s name or a `TUESDAY`-style day divider. The specimen above shows the
> pattern’s full intent — name · time · read state, with day separators — which
> is the target when the conversation view is fleshed out. Treat the bubble
> geometry and colours as authoritative today; treat the name and day divider as
> the direction.

## Import

There is nothing to import — the pattern is markup. The shape of each row:

```tsx
<div className={isMine ? "flex justify-end" : "flex justify-start"}>
  {!isMine && <Avatar size="sm">…</Avatar>}
  <div className="max-w-[72%]">
    <div className={
      isMine
        ? "rounded-2xl border px-4 py-2.5 text-[15.5px] bg-spruce-100 border-spruce-200 rounded-br-md"
        : "rounded-2xl border px-4 py-2.5 text-[15.5px] bg-parchment border-border rounded-bl-md"
    }>
      <p>{message.content}</p>
    </div>
    <p className="text-ink-faint mt-1 px-1.5 text-xs">{time}{readReceipt}</p>
  </div>
</div>
```

## Writing guidelines

- The empty conversation opens with a warm prompt, not a blank pane — the chat
  greets a newly active connection with “You’re connected! Say hello to
  {first name}.”
- Keep system copy in the chat gentle and unhurried; the surrounding banners use
  language like “Relationships grow at their own pace.”
- Times are short and lowercase (“2:14 pm”); dates in the divider are uppercase
  day names.

## Accessibility

- Alignment and colour both signal authorship, but they’re never the only cue —
  the meta line names the sender, so “mine” versus “theirs” survives without
  colour perception. See [Accessibility](../foundations/08-accessibility.md).
- The spruce-100 and parchment fills each carry body text at AA contrast.
- The message list scrolls within its own region and auto-scrolls to the newest
  message; the read receipt is conveyed in the text meta line, not by colour
  alone.

## Related

- [Avatar](avatar.md) — the sender avatar beside incoming messages
- [Dialog](dialog.md) — the partner-profile dialog opened from the chat header
- [Input](input.md) — the message composer at the foot of the chat
- [Colour](../foundations/03-color.md) — spruce-100 (mine) and parchment (theirs)
