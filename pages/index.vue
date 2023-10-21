<template>
  <div class="container">
    <div class="header">
      <div class="header__title">Task list</div>
      <Button
        class="header__button"
        label="ADD"
        @click="showCreateModal = true"
        autofocus
      />
    </div>
    <div v-if="taskStore.tasks.length > 0">
      <ClientOnly>
        <DataTable
          :value="taskStore.tasks"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          tableStyle="auto"
        >
          <Column field="text" header="Text" style="min-width: 220px"></Column>
          <Column field="completed" header="Completed" style="width: 200px">
            <template #body="slotProps">
              <div>
                <Tag
                  :value="slotProps.data.completed ? 'Yes' : 'No'"
                  :severity="slotProps.data.completed ? 'success' : 'warning'"
                />
              </div>
            </template>
          </Column>
          <Column field="_id" header="Execute" style="width: 150px">
            <template #body="slotProps">
              <div class="action-cell">
                <Button
                  :label="slotProps.data.completed ? 'Canсel' : 'Finish'"
                  rounded
                  :severity="slotProps.data.completed ? 'danger' : 'info'"
                  autofocus
                  @click="toggleTaskCompleted(slotProps.data)"
                />
              </div>
            </template>
          </Column>
          <Column field="_id" header="Action" style="width: 200px">
            <template #body="slotProps">
              <div class="action-buttons">
                <Button
                  label="Edit"
                  rounded
                  severity="info"
                  autofocus
                  @click="openEditModal(slotProps.data)"
                />
                <Button
                  class="delete-btn"
                  icon="pi pi-times"
                  rounded
                  severity="danger"
                  size="small"
                  autofocus
                  @click="deleteTask(slotProps.data._id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </ClientOnly>
    </div>
    <div class="empty-list" v-else>Task list is empty</div>
    <ClientOnly>
      <Dialog
        v-model:visible="showCreateModal"
        modal
        header="New Task"
        :style="{ width: '320px' }"
      >
        <span class="p-float-label">
          <InputText
            id="value"
            v-model.trim="createTaskText"
            type="text"
            :class="{ 'p-invalid': errorCreateModalMessage }"
            :style="{ width: '100%' }"
            aria-describedby="text-error"
          />
          <label for="value">Text</label>
        </span>
        <template #footer>
          <Button label="OK" @click="addTask" autofocus />
        </template>
      </Dialog>
    </ClientOnly>

    <ClientOnly>
      <Dialog
        v-model:visible="showEditModal"
        modal
        header="Edit task"
        :style="{ width: '320px' }"
      >
        <span class="p-float-label">
          <InputText
            id="value"
            v-model.trim="state.task.text"
            type="text"
            :class="{ 'p-invalid': errorEditModalMessage }"
            :style="{ width: '100%' }"
            aria-describedby="text-error"
          />
          <label for="value">Text</label>
        </span>
        <template #footer>
          <Button label="OK" @click="updateTask" autofocus />
        </template>
      </Dialog>
    </ClientOnly>

    <ClientOnly>
      <Toast />
    </ClientOnly>
  </div>
</template>

<script setup>
const taskStore = useTaskStore();
const toast = useToast();

const createTaskText = ref("");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const errorCreateModalMessage = ref(false);
const errorEditModalMessage = ref(false);
const state = reactive({
  task: {
    text: "",
    completed: false,
  },
});

useAsyncData(async () => await taskStore.getAll(), {
  initialCache: false,
});

async function addTask() {
  if (createTaskText.value.length < 3) {
    errorCreateModalMessage.value = true;
    toast.add({
      severity: "warn",
      summary: "warning",
      detail: "length must be at least 3 characters",
      life: 3000,
    });
    return;
  }
  await taskStore
    .add({
      text: createTaskText.value,
      completed: false,
    })
    .then(() => {
      showCreateModal.value = false;
      resetCreateForm();
      toast.add({
        severity: "success",
        summary: "success",
        detail: "task added successfully",
        life: 3000,
      });
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: "error",
        detail: error?.data?.message,
        life: 3000,
      });
    });
}

async function toggleTaskCompleted(task) {
  task.completed = !task.completed;
  await taskStore.update(task._id, task);
}

async function updateTask() {
  if (state.task.text.length < 3) {
    errorEditModalMessage.value = true;
    toast.add({
      severity: "warn",
      summary: "warning",
      detail: "length must be at least 3 characters",
      life: 3000,
    });
    return;
  }
  await taskStore
    .update(state.task._id, state.task)
    .then(() => {
      showEditModal.value = false;
      resetEditForm();
      toast.add({
        severity: "success",
        summary: "success",
        detail: "task updated successfully",
        life: 3000,
      });
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: "error",
        detail: error?.data?.message,
        life: 3000,
      });
    });
}

async function deleteTask(id) {
  await taskStore
    .remove(id)
    .then(() => {
      showEditModal.value = false;
      resetEditForm();
      toast.add({
        severity: "success",
        summary: "success",
        detail: "task deleted successfully",
        life: 3000,
      });
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: "error",
        detail: error?.data?.message,
        life: 3000,
      });
    });
}

function openEditModal(task) {
  state.task = { ...task };
  showEditModal.value = true;
}

function resetCreateForm() {
  createTaskText.value = "";
  errorCreateModalMessage.value = false;
}
function resetEditForm() {
  errorEditModalMessage.value = false;
}
</script>

<style>
.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 25px 0 20px 0;
}
.header__title {
  font-size: 28px;
  line-height: 32px;
  font-weight: 600;
}
.header__button {
  margin-left: 12px;
}
.action-buttons {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.delete-btn {
  margin-left: 8px;
}
.empty-list {
  font-size: 24px;
  line-height: 28px;
  font-weight: 600;
}
</style>
