import ActorsMultiPlayRenderer from "./queries/renderers/ActorsMultiPlayRenderer";
import CriticsActiveRenderer from "./queries/renderers/CriticsActiveRenderer";
import CriticsStrictRenderer from "./queries/renderers/CriticsStrictRenderer";
import DualAwardPlaysRenderer from "./queries/renderers/DualAwardPlaysRenderer";
import GenreAvgRenderer from "./queries/renderers/GenreAvgRenderer";
import GenresRenderer from "./queries/renderers/GenresRenderer";
import GroupsNoAwardRenderer from "./queries/renderers/GroupsNoAwardRenderer";
import GroupTopRenderer from "./queries/renderers/GroupTopRenderer";
import MultiVenuePlaysRenderer from "./queries/renderers/MultiVenuePlaysRenderer";
import PlaysRenderer from "./queries/renderers/PlaysRenderer";
import VenuesRenderer from "./queries/renderers/VenuesRenderer";
import WorkshopsRenderer from "./queries/renderers/WorkshopsRenderer";

export default function Query() {
    return (<div>
        <PlaysRenderer/>
        <GroupTopRenderer/>
        <VenuesRenderer/>
        <CriticsActiveRenderer/>
        <GenreAvgRenderer/>
        <DualAwardPlaysRenderer/>
        <ActorsMultiPlayRenderer/>
        <GenresRenderer/>
        <WorkshopsRenderer/>
        <CriticsStrictRenderer/>
        <MultiVenuePlaysRenderer/>
        <GroupsNoAwardRenderer/>
    </div>);
}