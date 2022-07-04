import cl from '../styles/Layout.module.css';
import Link from "next/link";

const Layout = ({ children }) => {
    const title = 'опенсорсбезугроз';
    const year = '2022';
    const GH_avatar = '/fastlaw.png';
    const GH_repo = 'fastlawIo/shimakers_detektor';
    const GH_url = `https://github.com/${GH_repo}`;
    const licenses_name = 'GNU General Public License';
    const licenses_URL = 'https://www.gnu.org/licenses/gpl-3.0.html';

    return (
        <>
            <header className={cl.layout__header}>
                <h2>{title}</h2>
            </header>
            <div className={cl.layout__children}>
                {children}
            </div>
            <footer className={cl.layout__footer}>
                <figure className={cl.layout__footerFigure}>
                    <img src={GH_avatar} className={cl.layout__footerFigureImg} />
                    <figcaption>
                        <Link href={GH_url}><a>{GH_repo}</a></Link>
                    </figcaption>
                </figure>
                <Link href={licenses_URL}><a className={cl.layout__footerLicenses}>© {licenses_name}</a></Link> 
                <p>© {title} {year}</p>    
            </footer>
        </>
    )
};

export default Layout;