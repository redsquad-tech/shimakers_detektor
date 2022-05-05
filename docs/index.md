---
layout: home
title: О проекте
---

Приложение представляет собой парсер предоставленного датасета, основанного на [датасете](https://docs.google.com/spreadsheets/d/1cfc4wXYpaImYxVy_0IXpYNzSrOIPUAhzWtj6s6hlVb0/edit#gid=2074850979) с информацией о вредоносных контрибьютах в опенсорс проекты на GitHub. Результатом работы приложения является база потенциально опасных пулл руквестов от контрибьюторов из первоначального датасета.

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
  .table__wrapper {
    overflow: scroll;
  }
</style>

<script src="https://formspree.io/js/formbutton-v1.min.js" defer></script>
<script>
  window.formbutton=window.formbutton||function(){(formbutton.q=formbutton.q||[]).push(arguments)};
  formbutton("create", {
    action: "https://formspree.io/f/xqkngvza",
    title: "Свяжитесь с нами",
    fields: [{
      name: "name",
      type: "text",
      label: "Имя",
      placeholder: "Имя",
      required: false,
    },
    {
      name: "email",
      type: "email",
      label: "Почта",
      placeholder: "your@email.ru",
      required: true
    },
    {
      name: "message",
      type: "textarea",
      label: "Сообщение",
      placeholder: "Ваше сообщение",
      required: true
    },
    {
      name: "submit",
      type: "submit"
    }]
  })
</script>
