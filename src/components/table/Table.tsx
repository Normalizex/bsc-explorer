import React, { ReactElement, useEffect, useState } from "react";

import "./table.scss";

interface TableProps {
    thead: React.FC
    tbody: ReactElement | ReactElement[]
    limit?: number,
    pagesLimit?: number
}

const Table: React.FC<TableProps> = ({
    thead: Thead,
    tbody: Tbody,
    limit = 100,
    pagesLimit=NaN
}) => {
    const Tbodys: ReactElement[] = Array.isArray(Tbody) ? Tbody : [Tbody];
    const initialData = limit ? Tbodys.slice(0, Number(limit) || 100) : Tbodys;
    const [TableBody, setTableBody] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(0);

    const pageCount = Math.floor(Tbodys.length / limit);
    const pages = Tbodys.length % limit === 0 ? pageCount : pageCount + 1;
    const range: number[] = [...Array(pages).keys()];

    const selectPage = (page: number) => {
        const start = limit * page;
        const end = start + limit;
        
        setTableBody(Tbodys.slice(start, end));
        setCurrentPage(page);
    };

    useEffect(() => {
        const Tbodys: ReactElement[] = Array.isArray(Tbody) ? Tbody : [Tbody];

        const start = limit * currentPage;
        const end = start + limit;
        const initialData = limit ? Tbodys.slice(start, end) : Tbodys;
        setTableBody(initialData);
    }, [Tbody, limit, currentPage])

    return (
        <div>
            <div className="table-wrapper">
                <table>
                <thead>
                    <Thead />
                </thead>
                <tbody>
                    {TableBody}
                </tbody>
                </table>
            </div>
            { pages > 1 &&
                <div className="table__pagination">
                    {
                        range.map((page) => ( (isNaN(pagesLimit) || (page < pagesLimit)) &&
                            <div key={page} className={`table__pagination-item ${currentPage === page ? 'active' : ''}`} onClick={() => selectPage(page)}>
                                {page + 1}
                            </div>
                        ))
                    }
                </div>
            }
        </div>
  );
};

export default Table;