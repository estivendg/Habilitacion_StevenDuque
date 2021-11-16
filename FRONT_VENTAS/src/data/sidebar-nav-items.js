export default function() {
  return [
    {
      title: "Usuarios",
      to: "/usuarios",
      htmlBefore: '<i class="material-icons">hiking</i>',
      htmlAfter: ""
    },

    {
      title: "Productos",
      htmlBefore: '<i class="material-icons">work</i>',
      to: "/productos"
    },
    {
      title: "Ventas",
      htmlBefore: '<i class="material-icons">search</i>',
      to: "/ventas"
    },
  ];
}
