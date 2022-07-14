import Layout from '../components/Layout';
import MainContent from '../components/MainContent';
import Script from 'next/script';
import path from 'path';
import fs from 'fs';
import Papa from 'papaparse';

const Index = ({ file }) => {
  // TODO: hide id in .env
  const form_id = 'xqkngvza';

  return (
      <Layout>
          <MainContent file={file} />
          <Script 
            src="https://formspree.io/js/formbutton-v1.min.js" 
            strategy="lazyOnload" 
            onLoad={() => {
              window.formbutton=window.formbutton||function(){(formbutton.q=formbutton.q||[]).push(arguments)};
               
              formbutton("create", {
                  action: `https://formspree.io/f/${form_id}`,
                  title: "Свяжитесь с нами",
                  fields: [{
                  name: "email",
                  type: "email",
                  label: "Ваш email",
                  placeholder: "your@email.ru",
                  required: true
                  },
                  {
                  name: "link",
                  type: "text",
                  label: "Ссылка на вредоносный источник",
                  placeholder: "https://github.com/{username}...",
                  required: true
                  },
                  {
                  name: "message",
                  type: "text",
                  label: "Тип уязвимости",
                  placeholder: "DDoS/Малварь...",
                  required: true
                  },
                  {
                  name: "submit",
                  type: "submit",
                  value: "Отправить"
                  }],
                  styles: {
                  title: {
                      background: "#8b949e"
                  },
                  button: {
                      background: "#8b949e"
                  },
                  }
              })
            }}
          />
      </Layout>
  )
};


export const getStaticProps = async () => {
    const file_path = path.join('public', 'result.csv');
    
    const file = new Promise((resolve, reject) => {
        fs.readFile(file_path, 'utf8', (err, data) => {
            if (err) reject(err);
            
            resolve(data);
        });
    });

    const csv = await file;

    const { data } = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });
  
    return {
      props: {
        file: data
      },
    }
  }
  
export default Index;