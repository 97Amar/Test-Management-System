import { useNavigate } from 'react-router-dom';
import './QuestionSidebar.scss';
import logo from '@assets/images/loginPageLogo.png';
import {
    GraphIcon,
    PenIcon,
    InfoIcon,
    PeoplleIcon,
    HomeIcon,
    PersonIcon,
    DustbinIcon,
    RupeeIcon,
    TrophyIcon,
    MesgIcon,
    BellIcon,
    SettingIcon,
    LeftArrows,
    TickIcon,
    DNDIcon,
} from "../../../assets/svgIcons/SvgIcons.tsx";
import { ROUTES } from '../../../constants/constants.ts';

interface IQuestion {
    id: string;
    type: string;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correct_option: string;
    explanation: string | null;
    difficulty: 'easy' | 'medium' | 'hard';
    paragraph: string | null;
    media_url: string | null;
    created_by: number;
    created_at: string;
    updated_by: number | null;
    updated_at: string | null;
    test_id: string;
    category: string | null;
    subject: string;
    topic: string | null;
    sub_topic: string | null;
}
interface QuestionSidebarProps {
    data: IQuestion[];
    onEdit?: (question: IQuestion) => void;
    onDelete?: (questionId: string) => void;
    isLoading?: boolean;
}

import Loader from '../../common/Loader/Loader.tsx';

const QuestionSidebar = ({ data, onEdit, onDelete, isLoading }: QuestionSidebarProps) => {
    const navigate = useNavigate();

    const stripHtml = (html: string) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const links = [
        { icon: <GraphIcon /> },
        { icon: <PenIcon /> },
        { icon: <InfoIcon /> },
        { icon: <PeoplleIcon /> },
        { icon: <HomeIcon /> },
        { icon: <PersonIcon /> },
        { icon: <DustbinIcon /> },
        { icon: <RupeeIcon /> },
        { icon: <TrophyIcon /> },
        { icon: <MesgIcon /> },
        { icon: <BellIcon /> },
        { icon: <SettingIcon /> },
    ]


    return (
        <>
            <div className="question_sidebar">
                <div className="my_logo" onClick={() => navigate(ROUTES.DASHBOARD)}>
                    <img
                        src={logo}
                        alt="PrepRoute"
                        className="sidebar-logo-image"
                    />
                </div>
                <div className='question_sidebar_main'>
                    <div className="question_left">
                        {
                            links.map((item, index) => (
                                <div className="icons" key={index}>
                                    {item.icon}
                                </div>
                            ))
                        }
                    </div>
                    <div className="questions_right" style={{ position: 'relative' }}>
                        {isLoading && <Loader absolute />}
                        <h3>Question creation
                            <button type="button" onClick={() => navigate('/create-test')}>
                                <LeftArrows />
                            </button>
                        </h3>
                        <h4>
                            Total Questions . <span>{data.length}</span>
                        </h4>

                        <ul>
                            {data?.map((question) => (
                                <li
                                    key={question.id}
                                    className={!question.correct_option ? 'dismiss' : ''}
                                >
                                    {question.correct_option ? <TickIcon /> : <DNDIcon />}

                                    <span className="question_name" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {stripHtml(question.question)}
                                    </span>

                                    <span style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                                        <div onClick={() => onEdit?.(question)}>
                                            <PenIcon />
                                        </div>
                                        <div onClick={() => onDelete?.(question.id)}>
                                            <DustbinIcon />
                                        </div>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionSidebar;