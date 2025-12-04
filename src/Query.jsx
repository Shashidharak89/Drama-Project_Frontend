import GroupTopRenderer from "./queries/renderers/GroupTopRenderer";
import PlaysRenderer from "./queries/renderers/PlaysRenderer";

export default function Query() {
    return (<div>
        <PlaysRenderer/>
        <GroupTopRenderer/>
    </div>);
}