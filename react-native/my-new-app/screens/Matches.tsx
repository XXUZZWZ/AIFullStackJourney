import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// 模拟匹配数据
const matches = [
  {
    id: '1',
    name: 'Alice',
    age: 25,
    bio: '热爱旅行和摄影',
    distance: '2km',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    matchedAt: '2小时前',
    unreadMessages: 3,
    isOnline: true
  },
  {
    id: '2',
    name: 'Bob',
    age: 28,
    bio: '软件工程师，喜欢户外运动',
    distance: '5km',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    matchedAt: '昨天',
    unreadMessages: 0,
    isOnline: false
  },
  {
    id: '3',
    name: 'Charlie',
    age: 26,
    bio: '设计师，热爱艺术和音乐',
    distance: '3km',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    matchedAt: '3天前',
    unreadMessages: 1,
    isOnline: true
  },
  {
    id: '4',
    name: 'Diana',
    age: 24,
    bio: '教师，喜欢阅读和烹饪',
    distance: '4km',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    matchedAt: '1周前',
    unreadMessages: 0,
    isOnline: false
  }
]

// 模拟消息数据
const messages = {
  '1': [
    { id: '1', text: '你好！很高兴认识你 😊', sender: 'them', time: '14:30' },
    { id: '2', text: '我也很高兴认识你！你的照片很漂亮', sender: 'me', time: '14:32' },
    { id: '3', text: '谢谢！你平时喜欢做什么？', sender: 'them', time: '14:35' }
  ],
  '2': [
    { id: '1', text: '嗨！最近怎么样？', sender: 'them', time: '昨天 10:20' }
  ],
  '3': [
    { id: '1', text: '周末有空一起喝咖啡吗？', sender: 'them', time: '今天 09:15' }
  ]
}

const Matches = () => {
  const [selectedTab, setSelectedTab] = useState<'matches' | 'messages'>('matches')
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderMatchItem = ({ item }: { item: typeof matches[0] }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => setSelectedMatch(item.id)}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.photo }}
          style={styles.avatar}
          resizeMode="cover"
        />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.matchInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.matchName}>{item.name}</Text>
          <Text style={styles.matchAge}>{item.age}</Text>
        </View>
        <Text style={styles.matchBio} numberOfLines={1}>{item.bio}</Text>
        <View style={styles.matchMeta}>
          <Ionicons name="location-outline" size={12} color="#999" />
          <Text style={styles.matchDistance}>{item.distance}</Text>
          <Text style={styles.matchTime}>{item.matchedAt}</Text>
        </View>
      </View>

      {item.unreadMessages > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadMessages}</Text>
        </View>
      )}
    </TouchableOpacity>
  )

  const renderMessageView = () => {
    if (!selectedMatch) return null

    const match = matches.find(m => m.id === selectedMatch)
    const matchMessages = messages[selectedMatch as keyof typeof messages] || []

    return (
      <View style={styles.messageView}>
        <View style={styles.messageHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedMatch(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.messageHeaderInfo}>
            <Text style={styles.messageHeaderName}>{match?.name}</Text>
            <Text style={styles.messageHeaderStatus}>
              {match?.isOnline ? '在线' : '离线'}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.messagesContainer}>
          {matchMessages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === 'me' ? styles.myMessage : styles.theirMessage
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
              <Text style={styles.messageTime}>{message.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="输入消息..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (selectedMatch) {
    return renderMessageView()
  }

  return (
    <View style={styles.container}>
      {/* 顶部标题和搜索 */}
      <View style={styles.header}>
        <Text style={styles.title}>匹配</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索匹配..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* 标签切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'matches' && styles.activeTab]}
          onPress={() => setSelectedTab('matches')}
        >
          <Text style={[styles.tabText, selectedTab === 'matches' && styles.activeTabText]}>
            匹配 ({matches.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'messages' && styles.activeTab]}
          onPress={() => setSelectedTab('messages')}
        >
          <Text style={[styles.tabText, selectedTab === 'messages' && styles.activeTabText]}>
            消息
          </Text>
        </TouchableOpacity>
      </View>

      {/* 匹配列表 */}
      <FlatList
        data={filteredMatches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4ECDC4',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  listContainer: {
    padding: 8,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ECDC4',
    borderWidth: 2,
    borderColor: '#fff',
  },
  matchInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  matchAge: {
    fontSize: 14,
    color: '#666',
  },
  matchBio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  matchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchDistance: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    marginRight: 12,
  },
  matchTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  messageView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  messageHeaderInfo: {
    flex: 1,
  },
  messageHeaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  messageHeaderStatus: {
    fontSize: 12,
    color: '#4ECDC4',
  },
  moreButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4ECDC4',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#4ECDC4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Matches