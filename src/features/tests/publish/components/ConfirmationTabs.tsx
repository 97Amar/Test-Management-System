import { Tab, Nav } from 'react-bootstrap';
import TestPublishWindow from './TestPublishWindow/TestPublishWindow';

interface Props {
    onPublish: (payload?: any) => Promise<any>;
    status?: string;
}

const ConfirmationTabs = ({ onPublish, status }: Props) => {
    return (
        <Tab.Container defaultActiveKey="publish">

            {/* NAV */}
            <Nav variant="tabs">
                <Nav.Item>
                    <Nav.Link eventKey="publish">Publish Now</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="schedule">Schedule Publish</Nav.Link>
                </Nav.Item>
            </Nav>

            {/* TAB CONTENT */}
            <Tab.Content className="mt-3">

                <Tab.Pane eventKey="publish">
                    <TestPublishWindow mode="publish" onConfirm={onPublish} status={status} />
                </Tab.Pane>

                <Tab.Pane eventKey="schedule">
                    <TestPublishWindow mode="schedule" onConfirm={onPublish} status={status} />
                </Tab.Pane>

            </Tab.Content>

        </Tab.Container>
    );
};

export default ConfirmationTabs;