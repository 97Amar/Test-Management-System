import Header from '../Header/Header';
import Sidebar from '../SideBar/Sidebar';
import './Mainlayout.scss';


interface Props {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    sidebar?: React.ReactNode;
}

const MainLayout = ({
    children,
    title,
    subtitle,
    sidebar,
}: Props) => {
    return (
        <div className="layout">
            {sidebar || <Sidebar />}

            <div className="layout-main">
                <Header title={title} subtitle={subtitle} />

                <div className="layout-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;