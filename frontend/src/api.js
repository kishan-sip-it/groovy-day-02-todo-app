const BASE_URL = "/api/todos";

async function parseResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export async function fetchTodos() {
  return parseResponse(await fetch(BASE_URL));
}

export async function createTodo(text) {
  return parseResponse(
    await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    })
  );
}

export async function updateTodo(id, changes) {
  return parseResponse(
    await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes)
    })
  );
}

export async function deleteTodo(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }
}
