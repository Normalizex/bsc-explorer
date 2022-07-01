import React from "react";

const NotFound: React.FC<{message: string}> = ({ message }) => {
    return (
        <div className='row'>
            <div className="col-12">
                <div className="card">
                    <div className="card__body">
                        <h1>404 | {message}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default NotFound;