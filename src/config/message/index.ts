import { mTPL } from './messageTemplate';

export { message };

const entity = {
  todo: {
    id: {
      isNumber: {
        message: mTPL.isNumber.m,
      },
    },
    title: {
      isString: {
        message: mTPL.isString.m,
      },
      isNotEmpty: {
        message: mTPL.isNotEmpty.m,
      },
      maxLength: {
        message: mTPL.maxLength.m,
      },
    },
    body: {
      isString: {
        message: mTPL.isString.m,
      },
      maxLength: {
        message: mTPL.maxLength.m,
      },
    },
  },
};

const dto = {
  task: {
    freeWord: {
      txt: {
        maxLength: {
          message: mTPL.maxLength.m,
        },
      },
    },
    getTask: {
      id: entity.todo.id,
    },
    addTask: {
      title: entity.todo.title,
      body: entity.todo.body,
    },
  },
};

const exception = {
  nothing: mTPL.nothing.m,
};

const message = {
  exception,
  dto,
  entity,
};
