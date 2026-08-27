"use client";

import React, { useState } from "react";
import { RetroWindow } from "./RetroWindow";
import { RecycleBinIcon, TextFileIcon } from "./Icons";

interface RecycleBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

const FIRST_CRUSH_TEXT = `----------------------------------------
        FIRST_CRUSH.TXT
        School Year: 2018–19
----------------------------------------

12 July 2018

It rained during the afternoon today.

I saw her on the roof when she went upstairs to bring the clothes in
before they got completely wet.

I was standing near the window pretending to look outside.

She didn't notice me.

I don't know why I kept thinking about it during the whole evening.

----------------------------------------

24 July 2018

Today she cleared my doubt in class.

I had been staring at the same question for almost ten minutes.

She noticed and said, "You don't understand this?"

Then she explained the whole thing in my notebook.

It was such a small thing.

But somehow it made my entire day.

----------------------------------------

3 August 2018

She asked me for a pen today.

A BLUE pen.

She returned it after class and said "Thanks."

I don't know why I remember such useless details.

----------------------------------------

17 August 2018

Teacher made new seating arrangements today.

And somehow she is sitting two benches away from me.

Best seating arrangement ever.

----------------------------------------

5 September 2018

Teacher's Day today.

She was helping everyone decorate the classroom.

There was glitter everywhere.

She got some on her face and didn't even notice.

I wanted to tell her.

I didn't.

----------------------------------------

21 September 2018

She sent me a message today asking for the homework.

Just:

"Hey, send today's homework pls."

I stared at that message for way too long before replying.

I finally replied:

"Yeah sure."

Very smooth.

----------------------------------------

10 October 2018

We had to stay back after school for the project.

Almost everyone left early.

For some reason, I didn't mind staying.

We talked about random things for nearly half an hour.

I don't remember what we talked about.

I just remember laughing a lot.

----------------------------------------

2 November 2018

Annual function practice today.

She was on stage and I was helping with decorations.

At one point she looked towards me and smiled.

Maybe she was smiling at someone else.

I am going to pretend it was me.

----------------------------------------

18 December 2018

Winter has finally started.

She came to school wearing a sweater that was way too big.

I wanted to tell her it looked cute.

Instead I asked:

"Isn't that sweater too big?"

Why am I like this?

----------------------------------------

14 January 2019

School started again after the holidays.

First thing I did when I entered the classroom was look for her.

She was already there.

She smiled and said "Hi."

That was enough.

----------------------------------------

1 February 2019

Today she borrowed my notes.

She said my handwriting was actually readable.

Nobody has ever complimented my handwriting before.

I think this is officially my greatest achievement.

----------------------------------------

14 February 2019

Valentine's Day.

Everyone was making jokes about who likes whom.

Someone asked me who my crush was.

I denied everything.

She was sitting right there.

I don't think she noticed.

Hopefully.

----------------------------------------

8 March 2019

Exams are getting closer.

She helped me with chemistry today.

She explained the same thing three times because I kept forgetting it.

She didn't get annoyed even once.

I wish I could tell her how much I appreciate her.

----------------------------------------

25 March 2019

Last few days of school.

Everyone is talking about holidays and plans.

We took a class photo today.

I made sure I was somewhere near her.

Obviously.

----------------------------------------

30 March 2019

Last day of the school year.

Everyone was signing each other's notebooks.

She wrote:

"Don't forget me. And study properly 😂"

I laughed when I read it.

Then I read it again when I got home.

And again.

----------------------------------------

31 March 2019

Maybe she never knew.

Maybe she knew and just never said anything.

Maybe it was never supposed to become anything.

But these little moments...

The rain.

The classroom.

The borrowed pen.

The homework messages.

The random conversations.

The smiles.

I think I'll remember them for a very long time.

----------------------------------------

STATUS: DELETED
RECOVERABLE: YES

Some memories were never really deleted.
----------------------------------------`;

export const RecycleBinModal: React.FC<RecycleBinModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onFocus,
}) => {
  const [isFileOpen, setIsFileOpen] = useState(false);

  return (
    <>
      <RetroWindow
        id="recycle-bin-window"
        title="Recycle Bin"
        icon={<RecycleBinIcon className="w-4 h-4" />}
        isOpen={isOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialX={120}
        initialY={100}
        initialWidth={440}
        initialHeight={300}
      >
        <div className="flex flex-col h-full text-xs font-sans">
          <div className="win-bevel-inset bg-white p-2 mb-2 flex items-center justify-between text-[#555555]">
            <span>1 object(s) in Recycle Bin</span>
            <span>Size: 4.8 KB</span>
          </div>

          <div className="win-bevel-inset bg-white flex-1 p-4 grid grid-cols-3 gap-4 align-start">
            {/* Deleted File: first_crush.txt */}
            <div
              onClick={() => setIsFileOpen(true)}
              onDoubleClick={() => setIsFileOpen(true)}
              className="flex flex-col items-center gap-1.5 p-2 rounded hover:bg-[#000080] hover:text-white cursor-pointer group text-center"
            >
              <TextFileIcon className="w-10 h-10 group-hover:scale-105 transition-transform" />
              <span className="truncate max-w-[110px] text-xs font-medium">first_crush.txt</span>
            </div>
          </div>
        </div>
      </RetroWindow>

      {/* Notepad Text Viewer for first_crush.txt */}
      {isFileOpen && (
        <RetroWindow
          id="first-crush-notepad"
          title="first_crush.txt - Notepad"
          icon={<TextFileIcon className="w-4 h-4" />}
          isOpen={isFileOpen}
          onClose={() => setIsFileOpen(false)}
          zIndex={zIndex + 10}
          onFocus={onFocus}
          initialX={160}
          initialY={80}
          initialWidth={480}
          initialHeight={420}
        >
          <div className="win-bevel-inset bg-white p-3.5 font-mono text-xs text-black whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[340px] select-text">
            {FIRST_CRUSH_TEXT}
          </div>
        </RetroWindow>
      )}
    </>
  );
};
