// src/components/InsertAllForms.jsx
import React from 'react';
import PlayForm from './PlayForm';
import GroupForm from './GroupForm';
import VenueForm from './VenueForm';
import CriticForm from './CriticForm';
import ActorForm from './ActorForm';
import WorkshopForm from './WorkshopForm';
import './styles/InsertForms.css';

export default function InsertAllForms() {
  return (
    <div className="tf-insert-grid">
      <div className="tf-col">
        <PlayForm />
      </div>

      <div className="tf-col">
        <GroupForm />
        <VenueForm />
        <ActorForm />
      </div>

      <div className="tf-col">
        <CriticForm />
        <WorkshopForm />
      </div>
    </div>
  );
}
