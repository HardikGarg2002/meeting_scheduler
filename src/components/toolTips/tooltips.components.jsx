import { Tooltip } from "bootstrap";
import { useEffect, useRef } from "react";

function CustomTooltip(props) {
    const tooltipRef = useRef();

    useEffect(() => {
        var tooltip = new Tooltip(tooltipRef.current, {
            title: props.title,
            placement: 'top',
            trigger: 'hover'
        })
    })

    return (
        <div ref={ tooltipRef } {...props}>{props.children}</div>
    )
}

export default CustomTooltip;