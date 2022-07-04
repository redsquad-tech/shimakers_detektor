import cl from '../styles/Main.module.css';
import Link from 'next/link';

const Main = ({ file }) => {
    const dataset_URL = 'https://docs.google.com/spreadsheets/d/1H3xPB4PgWeFcHjZ7NOPtrcya_Ua4jUolWm-7z9-jSpQ/htmlview#';
    const table_headers = Object.keys(file[0]);
    
    return (
        <>
            <h1>О проекте</h1>
            <p>На данной странице представлен список авторов проектов и коммитов в GitHub проекты, которые могут представлять опасность. Источник основан на публичном <Link href={dataset_URL}><a>датасете</a></Link>.</p> 
            <h2>Действия, совершенные опасными авторами</h2>

            <section className={cl.main__tableWrapper}>
                <table className={cl.main__table}>
                    <thead>
                        <tr>
                            {table_headers.map((title, index) => <th key={index}>{title}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {file.map((row, index) => {
                            return <tr key={index}>
                                {Object.values(row).map((cell, i) => {
                                    const current_cell = <td key={i}>{[1, 7].includes(i) ? <Link href={cell}><a>{cell}</a></Link> : cell}</td>;
                                return current_cell;
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
            </section>
        </>
    )
};

export default Main;