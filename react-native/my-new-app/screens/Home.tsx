import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// 模拟用户数据
const users = [
  {
    id: '1',
    name: 'Alice',
    age: 25,
    bio: '热爱旅行和摄影',
    distance: '2km',
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    ]
  },
  {
    id: '2',
    name: 'Bob',
    age: 28,
    bio: '软件工程师，喜欢户外运动',
    distance: '5km',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
    ]
  },
  {
    id: '3',
    name: 'Charlie',
    age: 26,
    bio: '设计师，热爱艺术和音乐',
    distance: '3km',
    photos: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400'
    ]
  },
  {
    id: '4',
    name: 'Lily',
    age: 23,
    bio: '舞蹈老师，热爱瑜伽和健身',
    distance: '1km',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400'
    ]
  },
  {
    id: '5',
    name: 'Emma',
    age: 27,
    bio: '时尚博主，喜欢分享生活美学',
    distance: '4km',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400'
    ]
  },
  {
    id: '6',
    name: 'Sophia',
    age: 24,
    bio: '咖啡师，擅长手冲咖啡和甜点制作',
    distance: '2.5km',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=400'
    ]
  },
  {
    id: '7',
    name: 'Olivia',
    age: 26,
    bio: '心理咨询师，喜欢阅读和冥想',
    distance: '3.2km',
    photos: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'
    ]
  },
  {
    id: '8',
    name: 'Ava',
    age: 22,
    bio: '大学生，主修艺术史，热爱博物馆',
    distance: '1.8km',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'
    ]
  },
  {
    id: '9',
    name: 'Isabella',
    age: 29,
    bio: '律师，工作认真，生活充满热情',
    distance: '4.5km',
    photos: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
      'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=400'
    ]
  },
  {
    id: '10',
    name: 'Mia',
    age: 25,
    bio: '花艺师，喜欢用鲜花装点生活',
    distance: '2.2km',
    photos: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400'
    ]
  }
]

const Home = () => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // 喜欢
      console.log('喜欢了:', users[currentUserIndex].name)
    } else {
      // 不喜欢
      console.log('不喜欢:', users[currentUserIndex].name)
    }

    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1)
    } else {
      // 重置到第一个用户
      setCurrentUserIndex(0)
    }
  }

  const currentUser = users[currentUserIndex]

  return (
    <View style={styles.container}>
      {/* 顶部搜索栏 */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索用户..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#666" />
        </TouchableOpacity>
      </View>




      {/* 用户卡片 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* 用户照片 */}
            <Image
              source={{ uri: currentUser.photos[0] }}
              style={styles.userImage}
              resizeMode="cover"
            />

            {/* 用户信息 */}
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>{currentUser.name}</Text>
                <Text style={styles.userAge}>{currentUser.age}</Text>
              </View>
              <Text style={styles.userBio}>{currentUser.bio}</Text>
              <View style={styles.distanceContainer}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.distanceText}>{currentUser.distance}</Text>
              </View>
            </View>

            {/* 操作按钮 */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.dislikeButton]}
                onPress={() => handleSwipe('left')}
              >
                <Ionicons name="close" size={24} color="#FF6B6B" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.likeButton]}
                onPress={() => handleSwipe('right')}
              >
                <Ionicons name="heart" size={24} color="#4ECDC4" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 推荐用户列表 */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>推荐用户</Text>
          <FlatList
            horizontal
            data={users}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.recommendationCard}>
                <Image
                  source={{ uri: item.photos[0] }}
                  style={styles.recommendationImage}
                  resizeMode="cover"
                />
                <Text style={styles.recommendationName}>{item.name}</Text>
                <Text style={styles.recommendationAge}>{item.age}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  userImage: {
    width: '100%',
    height: 300,
  },
  userInfo: {
    padding: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  userAge: {
    fontSize: 20,
    color: '#666',
  },
  userBio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dislikeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  likeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  recommendationsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recommendationCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  recommendationImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  recommendationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  recommendationAge: {
    fontSize: 12,
    color: '#666',
  },
})

export default Home