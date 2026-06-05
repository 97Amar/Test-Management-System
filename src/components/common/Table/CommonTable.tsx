import React, { Children, type ReactNode } from "react";
import { Col, Row, Table, Nav, Placeholder } from "react-bootstrap";
import "./CommonTable.scss";

// Simple NoRecord component
const NoRecord = () => (
    <div className="no_record">
        <span>📋</span>
        <p>No Record Found!</p>
    </div>
);

type TableProps = {
    tables: { key: string; columns: string[] }[];
    title?: string;
    rightContent?: ReactNode;
    lastColumnWidth?: string;
    className?: string;
    filterButton?: boolean;
    globalCheckbox?: boolean;
    showTabs?: boolean;
    children: ReactNode;
    activeTab?: string;
    onTabChange?: (tabKey: string) => void;
    colSpanConfig?: { [key: string]: number };
    isLoading?: boolean;
    tableData?: unknown[];
    length?: number;
};

const CommonTable = ({
    tables,
    title,
    rightContent,
    lastColumnWidth,
    className,
    filterButton,
    globalCheckbox,
    showTabs = false,
    children,
    activeTab,
    colSpanConfig = {},
    isLoading = false,
    tableData,
    onTabChange,
    length
}: TableProps) => {
    const activeTabKey = activeTab || tables?.[0]?.key;

    const currentTable = tables?.find(
        (table) => table?.key === activeTabKey
    );
    const columns = currentTable?.columns || tables?.[0]?.columns || [];

    const filteredChildren = Children.toArray(children).filter((child: ReactNode) => {
        if (showTabs && activeTabKey && React.isValidElement(child)) {
            const element = child as React.ReactElement<{ "data-tabkey"?: string }>;
            if (element?.props?.["data-tabkey"]) {
                return element?.props?.["data-tabkey"] === activeTabKey;
            }
        }
        return true;
    });

    return (
        <div className={`table_box ${className || ""}`}>
            {showTabs && (tables?.length ?? 0) > 1 && (
                <Nav
                    variant="tabs"
                    activeKey={activeTabKey}
                    onSelect={(eventKey) => {
                        if (eventKey && onTabChange) {
                            onTabChange(eventKey);
                        }
                    }}
                    className="table_box_tabs"
                >
                    {tables?.map((tab) => (
                        <Nav.Item key={tab?.key}>
                            <Nav.Link eventKey={tab?.key}>{tab?.key}</Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            )}

            {title && (
                <div className="table_box_head">
                    <Row className="align-items-center">
                        <Col>
                            <h4 className="table_title">{title}</h4>
                        </Col>
                        {rightContent && <Col className="text-end">{rightContent}</Col>}
                    </Row>
                </div>
            )}

            <Table responsive className={`${showTabs ? "tab_table" : ""}`}>
                <thead>
                    <tr>
                        {columns?.map((col, index) => (
                            <th
                                key={col}
                                style={
                                    index === columns.length - 1
                                        ? { width: lastColumnWidth, minWidth: lastColumnWidth }
                                        : {}
                                }
                                colSpan={colSpanConfig?.[col] || 1}
                            >
                                {globalCheckbox && index === 0 && (
                                    <input type="checkbox" className="global-checkbox" />
                                )}
                                {col}
                                {filterButton && (
                                    <button type="button" className="filter-btn">
                                        &#9660;
                                    </button>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        Array.from({ length: length ? length : 10 }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns?.map((_, index) => (
                                    <td key={index}>
                                        <Placeholder as="div" animation="glow">
                                            <Placeholder
                                                xs={12}
                                                style={{
                                                    height: '20px',
                                                    borderRadius: '4px',
                                                    margin: '4px 0'
                                                }}
                                            />
                                        </Placeholder>
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : filteredChildren?.length > 0 && Array.isArray(tableData) && tableData?.length > 0 ? (
                        filteredChildren
                    ) : (
                        <tr>
                            <td colSpan={columns?.length || 1} style={{ textAlign: "center" }}>
                                <NoRecord />
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default CommonTable;
