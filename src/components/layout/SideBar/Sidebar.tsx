import { NavLink, useNavigate } from 'react-router-dom';
import logo from '@assets/images/loginPageLogo.png';
import './sidebar.scss';
import { ROUTES } from '@constants/constants';

import { GraphIcon, PenIcon, QuestionsIcon } from '@assets/svgIcons/SvgIcons';

const navItems = [
    {
        path: ROUTES.DASHBOARD,
        label: 'Dashboard',
        icon: <GraphIcon />
    },
    {
        path: ROUTES.CREATE_TEST,
        label: 'Test Creation',
        icon: <PenIcon />
    },
    {
        path: '/test-tracking',
        label: 'Test Tracking',
        icon: <QuestionsIcon />
    }
];

const Sidebar = () => {
    const navigate = useNavigate();
    return (
        <aside className="sidebar">
            <div className="sidebar-logo" onClick={() => navigate(ROUTES.DASHBOARD)}>
                <img
                    src={logo}
                    alt="PrepRoute"
                    className="sidebar-logo-image"
                />
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;