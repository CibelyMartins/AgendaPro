const state = { categories: [], services: [], appointments: [] };
const titles = {
  inicio: "Visão geral",
  categorias: "Categorias",
  servicos: "Serviços",
  agendamentos: "Agendamentos",
};

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        '"': "&quot;",
      })[character],
  );

function showFeedback(message, type = "success") {
  const feedback = $("#feedback");
  feedback.textContent = message;
  feedback.className = `feedback show ${type}`;
  window.clearTimeout(showFeedback.timeout);
  showFeedback.timeout = window.setTimeout(() => {
    feedback.className = "feedback";
  }, 4500);
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.message || "Não foi possível concluir a operação.");
  return data;
}

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
function formatDate(value) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
function toInputDate(value) {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function setSection(section) {
  document
    .querySelectorAll(".page-section")
    .forEach((element) =>
      element.classList.toggle("active", element.id === section),
    );
  document
    .querySelectorAll(".nav-link")
    .forEach((element) =>
      element.classList.toggle("active", element.dataset.section === section),
    );
  $("#page-title").textContent = titles[section];
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function categoryName(id) {
  return (
    state.categories.find((category) => category.id === id)?.name ||
    "Categoria não encontrada"
  );
}
function serviceName(id) {
  return (
    state.services.find((service) => service.id === id)?.name ||
    "Serviço não encontrado"
  );
}

function fillSelects() {
  const categorySelect = $("#service-category");
  const serviceSelect = $("#appointment-service");
  const categoryValue = categorySelect.value;
  const serviceValue = serviceSelect.value;
  categorySelect.innerHTML =
    '<option value="">Selecione uma categoria</option>' +
    state.categories
      .map(
        (item) =>
          `<option value="${item.id}">${escapeHtml(item.name)}</option>`,
      )
      .join("");
  serviceSelect.innerHTML =
    '<option value="">Selecione um serviço</option>' +
    state.services
      .filter((item) => item.active)
      .map(
        (item) =>
          `<option value="${item.id}">${escapeHtml(item.name)} — ${formatCurrency(item.price)}</option>`,
      )
      .join("");
  categorySelect.value = categoryValue;
  serviceSelect.value = serviceValue;
}

function renderCategories() {
  const target = $("#categories-list");
  if (!state.categories.length) {
    target.innerHTML =
      '<div class="empty-state">Nenhuma categoria cadastrada.</div>';
    return;
  }
  target.innerHTML = state.categories
    .map(
      (item) =>
        `<article class="data-card"><div><h3>${escapeHtml(item.name)} <span class="tag ${item.active ? "active" : "inactive"}">${item.active ? "Ativa" : "Inativa"}</span></h3><p>${escapeHtml(item.description || "Sem descrição")}</p></div><div class="card-actions"><button class="icon-button" title="Editar" data-edit-category="${item.id}">✎</button><button class="icon-button delete" title="Excluir" data-delete-category="${item.id}">×</button></div></article>`,
    )
    .join("");
}

function renderServices() {
  const target = $("#services-list");
  if (!state.services.length) {
    target.innerHTML =
      '<div class="empty-state">Nenhum serviço cadastrado.</div>';
    return;
  }
  target.innerHTML = state.services
    .map(
      (item) =>
        `<article class="data-card"><div><h3>${escapeHtml(item.name)} <span class="tag ${item.active ? "active" : "inactive"}">${item.active ? "Ativo" : "Inativo"}</span></h3><p>${escapeHtml(item.description || "Sem descrição")}</p><p class="metadata">${escapeHtml(categoryName(item.category_id))} · ${formatCurrency(item.price)} · ${item.duration_minutes} min</p></div><div class="card-actions"><button class="icon-button" title="Editar" data-edit-service="${item.id}">✎</button><button class="icon-button delete" title="Excluir" data-delete-service="${item.id}">×</button></div></article>`,
    )
    .join("");
}

function renderAppointments() {
  const target = $("#appointments-list");
  const ordered = [...state.appointments].sort(
    (a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at),
  );
  if (!ordered.length) {
    target.innerHTML =
      '<div class="empty-state">Nenhum agendamento cadastrado.</div>';
    return;
  }
  target.innerHTML = ordered
    .map(
      (item) =>
        `<article class="data-card"><div><h3>${escapeHtml(item.client_name)} <span class="tag ${item.status}">${escapeHtml(item.status)}</span></h3><p>${escapeHtml(serviceName(item.service_id))} · ${formatDate(item.scheduled_at)}</p><p class="metadata">${escapeHtml(item.client_phone)}${item.notes ? ` · ${escapeHtml(item.notes)}` : ""}</p></div><div class="card-actions"><button class="icon-button" title="Editar" data-edit-appointment="${item.id}">✎</button><button class="icon-button delete" title="Excluir" data-delete-appointment="${item.id}">×</button></div></article>`,
    )
    .join("");
}

function renderOverview() {
  $("#categories-count").textContent = state.categories.length;
  $("#services-count").textContent = state.services.length;
  $("#appointments-count").textContent = state.appointments.length;
  const target = $("#recent-appointments");
  const next = [...state.appointments]
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
    .slice(0, 5);
  if (!next.length) {
    target.innerHTML = "Nenhum agendamento cadastrado ainda.";
    return;
  }
  target.innerHTML = next
    .map(
      (item) =>
        `<div class="recent-item"><div class="date-box">${new Date(item.scheduled_at).getDate()}</div><div><strong>${escapeHtml(item.client_name)}</strong><span>${escapeHtml(serviceName(item.service_id))} · ${formatDate(item.scheduled_at)}</span></div></div>`,
    )
    .join("");
}

function renderAll() {
  fillSelects();
  renderCategories();
  renderServices();
  renderAppointments();
  renderOverview();
}

async function loadData(showMessage = false) {
  try {
    const [categories, services, appointments] = await Promise.all([
      request("/categories"),
      request("/services"),
      request("/appointments"),
    ]);
    state.categories = categories;
    state.services = services;
    state.appointments = appointments;
    renderAll();
    if (showMessage) showFeedback("Dados atualizados com sucesso.");
  } catch (error) {
    showFeedback(
      error.message || "Não foi possível carregar os dados.",
      "error",
    );
  }
}

function resetCategoryForm() {
  $("#category-form").reset();
  $("#category-id").value = "";
  $("#category-active").checked = true;
  $("#category-form-title").textContent = "Nova categoria";
  $("#category-submit").textContent = "Salvar categoria";
  document.querySelector('[data-cancel="category"]').classList.add("hidden");
}
function resetServiceForm() {
  $("#service-form").reset();
  $("#service-id").value = "";
  $("#service-active").checked = true;
  $("#service-form-title").textContent = "Novo serviço";
  $("#service-submit").textContent = "Salvar serviço";
  document.querySelector('[data-cancel="service"]').classList.add("hidden");
}
function resetAppointmentForm() {
  $("#appointment-form").reset();
  $("#appointment-id").value = "";
  $("#appointment-status").value = "agendado";
  $("#appointment-form-title").textContent = "Novo agendamento";
  $("#appointment-submit").textContent = "Salvar agendamento";
  document.querySelector('[data-cancel="appointment"]').classList.add("hidden");
}

$("#category-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = $("#category-id").value;
  const body = {
    name: $("#category-name").value,
    description: $("#category-description").value,
    active: $("#category-active").checked,
  };
  try {
    await request(id ? `/categories/${id}` : "/categories", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(body),
    });
    showFeedback(
      id
        ? "Categoria atualizada com sucesso."
        : "Categoria criada com sucesso.",
    );
    resetCategoryForm();
    await loadData();
  } catch (error) {
    showFeedback(error.message, "error");
  }
});

$("#service-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = $("#service-id").value;
  const body = {
    category_id: $("#service-category").value,
    name: $("#service-name").value,
    description: $("#service-description").value,
    price: Number($("#service-price").value),
    duration_minutes: Number($("#service-duration").value),
    active: $("#service-active").checked,
  };
  try {
    await request(id ? `/services/${id}` : "/services", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(body),
    });
    showFeedback(
      id ? "Serviço atualizado com sucesso." : "Serviço criado com sucesso.",
    );
    resetServiceForm();
    await loadData();
  } catch (error) {
    showFeedback(error.message, "error");
  }
});

$("#appointment-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = $("#appointment-id").value;
  const dateValue = $("#appointment-date").value;
  const body = {
    service_id: $("#appointment-service").value,
    client_name: $("#appointment-client").value,
    client_phone: $("#appointment-phone").value,
    scheduled_at: new Date(dateValue).toISOString(),
    status: $("#appointment-status").value,
    notes: $("#appointment-notes").value,
  };
  try {
    await request(id ? `/appointments/${id}` : "/appointments", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(body),
    });
    showFeedback(
      id
        ? "Agendamento atualizado com sucesso."
        : "Agendamento criado com sucesso.",
    );
    resetAppointmentForm();
    await loadData();
  } catch (error) {
    showFeedback(error.message, "error");
  }
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.section) setSection(button.dataset.section);
  if (button.dataset.goTo) setSection(button.dataset.goTo);
  if (button.id === "refresh-button") await loadData(true);
  if (button.dataset.cancel)
    ({
      category: resetCategoryForm,
      service: resetServiceForm,
      appointment: resetAppointmentForm,
    })[button.dataset.cancel]();

  const editCategory = button.dataset.editCategory;
  if (editCategory) {
    const item = state.categories.find(
      (category) => category.id === editCategory,
    );
    $("#category-id").value = item.id;
    $("#category-name").value = item.name;
    $("#category-description").value = item.description || "";
    $("#category-active").checked = item.active;
    $("#category-form-title").textContent = "Editar categoria";
    $("#category-submit").textContent = "Atualizar categoria";
    document
      .querySelector('[data-cancel="category"]')
      .classList.remove("hidden");
    setSection("categorias");
  }
  const editService = button.dataset.editService;
  if (editService) {
    const item = state.services.find((service) => service.id === editService);
    $("#service-id").value = item.id;
    $("#service-category").value = item.category_id;
    $("#service-name").value = item.name;
    $("#service-description").value = item.description || "";
    $("#service-price").value = item.price;
    $("#service-duration").value = item.duration_minutes;
    $("#service-active").checked = item.active;
    $("#service-form-title").textContent = "Editar serviço";
    $("#service-submit").textContent = "Atualizar serviço";
    document
      .querySelector('[data-cancel="service"]')
      .classList.remove("hidden");
    setSection("servicos");
  }
  const editAppointment = button.dataset.editAppointment;
  if (editAppointment) {
    const item = state.appointments.find(
      (appointment) => appointment.id === editAppointment,
    );
    $("#appointment-id").value = item.id;
    $("#appointment-service").value = item.service_id;
    $("#appointment-client").value = item.client_name;
    $("#appointment-phone").value = item.client_phone;
    $("#appointment-date").value = toInputDate(item.scheduled_at);
    $("#appointment-status").value = item.status;
    $("#appointment-notes").value = item.notes || "";
    $("#appointment-form-title").textContent = "Editar agendamento";
    $("#appointment-submit").textContent = "Atualizar agendamento";
    document
      .querySelector('[data-cancel="appointment"]')
      .classList.remove("hidden");
    setSection("agendamentos");
  }

  const remove = async (path, label) => {
    if (!window.confirm(`Deseja excluir ${label}?`)) return;
    try {
      await request(path, { method: "DELETE" });
      showFeedback(
        `${label[0].toUpperCase()}${label.slice(1)} excluído com sucesso.`,
      );
      await loadData();
    } catch (error) {
      showFeedback(error.message, "error");
    }
  };
  if (button.dataset.deleteCategory)
    await remove(`/categories/${button.dataset.deleteCategory}`, "a categoria");
  if (button.dataset.deleteService)
    await remove(`/services/${button.dataset.deleteService}`, "o serviço");
  if (button.dataset.deleteAppointment)
    await remove(
      `/appointments/${button.dataset.deleteAppointment}`,
      "o agendamento",
    );
});

loadData();
