---
layout: home
title: О проекте
---

На данной странице представлен список авторов проектов и коммитов в GitHub проекты, которые могут представлять опасность. <a href="/static/raw.csv" download>Источник</a> основан на публичном [датасете](https://docs.google.com/spreadsheets/d/1H3xPB4PgWeFcHjZ7NOPtrcya_Ua4jUolWm-7z9-jSpQ/htmlview#).

<h2>База</h2>

<div class="table__wrapper">
  <table>
    {% for row in site.data.result %}
      {% if forloop.first %}
      <tr>
        {% for pair in row %}
          <th>{{ pair[0] }}</th>
        {% endfor %}
      </tr>
      {% endif %}

      {% tablerow pair in row %}
        {% if pair[0] == 'Потенциально опасный PR автора' or pair[0] == 'Исходный вредоносный вклад' %}
          <a href="{{ pair[1] }}" target="_blank">{{ pair[1] }}</a>
          {% else %}
          {{ pair[1] }}
        {% endif %}
      {% endtablerow %}
    {% endfor %}

  </table>
</div>

<style>
  .wrapper {
    max-width: calc(100% - 150px) !important;
  }

  .table__wrapper {
    height: 100vh;
    overflow: scroll;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
  }
  
  .formbutton::before {
    display: block !important;
    position: absolute;
    content: "Добавить проблемный источник" !important;
    white-space: nowrap;
    right: 80px;
    color: #8b949e;
  }

  @media screen and (max-width: 920px) {
    body {
      font-size: 0.5rem !important;
    }

    .wrapper {
      max-width: calc(100% - 64px) !important;
    }
  }
</style>

<script src="https://formspree.io/js/formbutton-v1.min.js" defer></script>
<script>
  window.formbutton=window.formbutton||function(){(formbutton.q=formbutton.q||[]).push(arguments)};
  formbutton("create", {
    action: "https://formspree.io/f/xqkngvza",
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
</script>
<script src="sort.js"></script>
