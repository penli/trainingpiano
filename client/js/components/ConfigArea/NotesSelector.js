import React, { useState, useEffect, useContext } from 'react';
import OctaveButton from './OctaveButton';
import { findMidiNote } from 'app/utils';
import styled from 'styled-components';

import { Context } from 'store';

const Selector = styled.div`
`;

export default ({ onChange }) => {

  const [state, dispatch] = useContext(Context);

  const [notes, setNotes] = useState([
    { lower: 'C/3', upper: 'B/3', selected: false },
    { lower: 'C/4', upper: 'B/4', selected: false },
    { lower: 'C/5', upper: 'B/5', selected: false },
    { lower: 'C/6', upper: 'B/6', selected: false },
  ]);

  useEffect(() => {
    updateNotes();
  }, [state.config.lowerNote, state.config.upperNote]);

  const isSelected = (note) => (
    findMidiNote(note.lower) >= findMidiNote(state.config.lowerNote) &&
    findMidiNote(note.upper) <= findMidiNote(state.config.upperNote)
  );

  const updateNotes = () => {
    setNotes(notes.map(note => ({...note, selected: isSelected(note)})));
  };

  const onClick = (idx) => {
    if (!onChange) return;
    const newNotes = JSON.parse(JSON.stringify(notes)); /* deep clone */
    newNotes[idx].selected = !newNotes[idx].selected;
    const isAdding = newNotes[idx].selected;
    let lower, upper;
    const firstSelectedIdx = newNotes.findIndex(note => note.selected);
    if (firstSelectedIdx === -1) return; /* no octave selected */
    lower = newNotes[firstSelectedIdx].lower;
    if (!isAdding) { /* is removing octave */
      for (let i = firstSelectedIdx; i < newNotes.length; i++) {
        if (newNotes[i].selected) {
          upper = newNotes[i].upper;
        } else {
          break;
        }
      }
    } else { /* is adding octave */
      upper = [...newNotes].reverse().find(note => note.selected).upper;
    }
    onChange(lower, upper);
    updateNotes();
  };

  return <Selector>
    { notes && notes.map((note, idx) => <OctaveButton
      key={note.lower}
      lower={note.lower}
      upper={note.upper}
      selected={note.selected}
      onClick={onClick.bind(this, idx)}
    />
    )}
  </Selector>;

};

