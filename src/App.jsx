import {
  createBrowserRouter,
  RouterProvider,
  Outlet, useNavigate,
} from 'react-router-dom';
import Lab1 from './Lab1/Lab1.jsx';
import Lab2 from './Lab2/Lab2.jsx';
import Lab3 from './Lab3/Lab3.jsx';
import Lab4 from './Lab4/Lab4.jsx';
import Lab5 from './Lab5/Lab5.jsx';
import { Button } from 'antd';
import S from './App.module.css';

const Root = () => {
  const navigate = useNavigate();
  
  const handleNavigateLab = (id) => {
    navigate(`/${id}`);
  }
  
  return (
    <div>
      <div className={S.buttonGroup}>
        <Button onClick={()=>handleNavigateLab('lab1')} type="primary">Лабораторна робота 1</Button>
        <Button onClick={()=>handleNavigateLab('lab2')}  type="primary">Лабораторна робота 2</Button>
        <Button onClick={()=>handleNavigateLab('lab3')}  type="primary">Лабораторна робота 3</Button>
        <Button onClick={()=>handleNavigateLab('lab4')}  type="primary">Лабораторна робота 4</Button>
        <Button onClick={()=>handleNavigateLab('lab5')}  type="primary">Лабораторна робота 5</Button>
      </div>
      <Outlet/>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/lab1', element: <Lab1 />},
      { path: '/lab2', element: <Lab2 /> },
      { path: '/lab3', element: <Lab3 /> },
      { path: '/lab4', element: <Lab4 /> },
      { path: '/lab5', element: <Lab5 /> }
    ]
  },
]);



function App() {
  return <RouterProvider router={router}/>;
}

export default App;
