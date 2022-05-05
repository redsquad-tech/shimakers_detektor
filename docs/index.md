---
layout: home
title: О проекте
---

На данной странице представлен список авторов проектов и коммитов в GitHub проекты, которые могут представлять опасность. <a href="/static/result.csv" download>Источник</a> основан на публичном [датасете](https://docs.google.com/spreadsheets/d/1cfc4wXYpaImYxVy_0IXpYNzSrOIPUAhzWtj6s6hlVb0/edit#gid=2074850979).

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
        {{ pair[1] }}
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
