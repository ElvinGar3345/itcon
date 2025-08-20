function showForm(formId){
    document.querySelectorAll(".caja-formulario").forEach(form => form.classList.remove("active"))
    document.getElementById(formId).classList.add("active");
}
