import useTitle from '@/hooks/useTitle';
import { Button, List, Cell, Card } from 'react-vant';

const Collection = () => {
  useTitle('景点收藏');

  const items = [
    { id: 1, title: '景点1', description: '这是第一个景点的描述' },
    { id: 2, title: '景点2', description: '这是第二个景点的描述' },
    { id: 3, title: '景点3', description: '这是第三个景点的描述' },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Card style={{ marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 8px 0' }}>我的景点收藏</h2>
        <p style={{ color: '#666', margin: 0 }}>这里是你的景点收藏列表。</p>
      </Card>
      
      <Card style={{ marginBottom: 16 }}>
        <List>
          {items.map((item) => (
            <Cell 
              key={item.id} 
              title={item.title}
              style={{ borderBottom: '1px solid #f0f0f0' }}
            >
              <div style={{ color: '#999', fontSize: '14px' }}>
                {item.description}
              </div>
            </Cell>
          ))}
        </List>
      </Card>
      
      <Button 
        type="primary" 
        block 
        style={{ marginTop: 16, borderRadius: '8px' }}
      >
        添加新的景点
      </Button>
    </div>
  );
};

export default Collection;

