import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
app.use(cors<Request>());
app.use(express.json())

const port = 4500;
let nextId = 4;

type TodoItem = {
  id?: number,
  completed: boolean,
  item: string
}

let todos: TodoItem[] = [
  {
    id: 1,
    item: 'Todo1',
    completed: false
  },
  {
    id: 2,
    item: 'Todo2',
    completed: false
  },
  {
    id: 3,
    item: 'Todo3',
    completed: true
  }
];

type Post = {
  id?: number,
  text: string
};

let posts: Post[] = [
  {
    id: 1,
    text: "1 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
  },
  {
    id: 2,
    text: "2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
  },
  {
    id: 3,
    text: "3 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
  },
]

app.get('/welcome', (req: Request, res: Response, next: NextFunction) => {
  res.send('welcome!');
});

//Todo 전체 조회
app.get('/api/todos', (req: Request, res: Response) => {
  setTimeout(() => {
    res.send(todos);
  }, 1000);
});

//Todo 1개 조회
app.get('/api/todos/:id', (req: Request, res: Response) => {
  const todo = todos.find(t => t.id == +req.params.id);

  if (todo) {
    res.status(200).json(todo);
  } else {
    res.status(404).send({ error: 'Todo not found' });
  }
});

//Todo 등록
app.post('/api/todos', (req: Request, res: Response) => {
  const todo: TodoItem = { id: getNextId(), ...req.body };
  todos = [...todos, todo];
  console.log('post ', todos);
  res.send(todos);
});

//Todo 1개 삭제
app.delete('/api/todos/:id', (request: Request, response: Response) => {
  // 변수를 선언합니다.
  let id = Number(request.params.id);
  const todoIndex = todos.findIndex(f => f.id == id);

  if (isNaN(id)) {
    // 오류: 잘못된 경로
    response.send({
      error: '숫자를 입력하세요!'
    });
  } else if (todos[todoIndex]) {
    // 정상: 데이터 삭제
    todos.splice(todoIndex, 1);
    response.send(todos);
  } else {
    // 오류: 요소가 없을 경우
    response.send({
      error: '존재하지 않는 데이터입니다!'
    });
  }
});

//Todo 전체삭제
app.delete('/api/todos', (req: Request, res: Response) => {
  todos.splice(0, todos.length);
  res.send(todos);
});

//Todo 수정
app.put('/api/todos/:id', (req: Request, res: Response) => {
  let id = Number(req.params.id);
  const todoIndex = todos.findIndex(f => f.id == id);

  if (todoIndex > -1) {
    const todo = { ...todos[todoIndex], ...req.body };

    todos = [
      ...todos.slice(0, todoIndex),
      todo,
      ...todos.slice(todoIndex + 1),
    ];

    res.send(todos);
  } else {
    res.status(404).send({ error: 'Todo not found' });
  }
});

//Post 전체 조회
app.get('/api/posts', (req: Request, res: Response) => {
  setTimeout(() => {
    res.send(posts);
  }, 1000);
});

//Post 등록
app.post('/api/posts', (req: Request, res: Response) => {
  const newpost = { id: getNextId(), ...req.body };
  posts = [...posts, newpost];
  res.status(200).json(posts);
});

//Post 1개 조회
app.get('/api/posts/:id', (req: Request, res: Response) => {
  const post = posts.find(p => p.id == +req.params.id);

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).send({ error: 'Post not found' });
  }
});

//post 1개 삭제
app.delete('/api/posts/:id', (request: Request, response: Response) => {
  // 변수를 선언합니다.
  const id = Number(request.params.id);
  const postIndex = posts.findIndex(f => f.id == id);

  if (isNaN(id)) {
    // 오류: 잘못된 경로
    response.send({
      error: '숫자를 입력하세요!'
    });
  } else if (posts[postIndex]) {
    // 정상: 데이터 삭제
    posts.splice(postIndex, 1);
    response.send(posts);
  } else {
    // 오류: 요소가 없을 경우
    response.send({
      error: '존재하지 않는 데이터입니다!'
    });
  }
});

function getNextId(): number {
  return nextId++;
}

app.listen(port, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${port}🛡️
  ################################################
`);
});