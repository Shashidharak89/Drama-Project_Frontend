import CriticsActiveRenderer from "./queries/renderers/CriticsActiveRenderer";
import GenreAvgRenderer from "./queries/renderers/GenreAvgRenderer";
import GroupTopRenderer from "./queries/renderers/GroupTopRenderer";
import PlaysRenderer from "./queries/renderers/PlaysRenderer";
import VenuesRenderer from "./queries/renderers/VenuesRenderer";

export default function Query() {
    return (<div>
        <PlaysRenderer/>
        <GroupTopRenderer/>
        <VenuesRenderer/>
        <CriticsActiveRenderer/>
        <GenreAvgRenderer/>
    </div>);
}