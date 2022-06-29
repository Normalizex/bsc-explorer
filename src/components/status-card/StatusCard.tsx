import React from "react";

import './status-card.scss';

interface StatusCardProps {
    count: number | string
    title: string
    icon: string
}

const StatusCard: React.FC<StatusCardProps> = ({
    count,
    title,
    icon
}) => {
    return (
        <div className='status-card'>
            <div className="status-card__icon">
                <i className={icon} />
            </div>
            <div className="status-card__info">
                <h4>{count}</h4>
                <span>{title}</span>
            </div>
        </div>
    )
};

export default StatusCard;