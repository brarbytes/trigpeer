import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabViewProps {
  onLogout: () => void;
  username: string;
}

type IconName = 'home' | 'home-outline' | 'compass' | 'compass-outline' | 'add-circle' | 'add-circle-outline' | 'people' | 'people-outline' | 'person' | 'person-outline' | 'star' | 'heart' | 'heart-outline' | 'chatbubble-outline' | 'share-outline' | 'search' | 'options-outline' | 'log-out-outline';

interface Tab {
  key: string;
  label: string;
  icon: IconName;
  activeIcon: IconName;
  badge: number;
}

const tabs: Tab[] = [
  { 
    key: 'home', 
    label: 'Home', 
    icon: 'home-outline', 
    activeIcon: 'home',
    badge: 0
  },
  { 
    key: 'discover', 
    label: 'Discover', 
    icon: 'compass-outline', 
    activeIcon: 'compass',
    badge: 0
  },
  { 
    key: 'ask', 
    label: 'Ask', 
    icon: 'add-circle-outline', 
    activeIcon: 'add-circle',
    badge: 0
  },
  { 
    key: 'groups', 
    label: 'Groups', 
    icon: 'people-outline', 
    activeIcon: 'people',
    badge: 0
  },
  { 
    key: 'profile', 
    label: 'Profile', 
    icon: 'person-outline', 
    activeIcon: 'person',
    badge: 0
  },
];

type SkillLevel = 'expert' | 'intermediate' | 'beginner';

interface FeedItem {
  id: string;
  author: string;
  avatar: string;
  question: string;
  likes: number;
  comments: number;
  timeAgo: string;
  tags: string[];
  emotions: string[];
  skillLevel: SkillLevel;
  earnings: number;
}

interface Expert {
  id: string;
  name: string;
  avatar: string;
  expertise: string[];
  rating: number;
  currentQuestions: number;
  maxQuestions: number;
  validationCount: number;
  points: number;
  level: number;
  totalAnswers: number;
  totalValidations: number;
}

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  emotions: string[];
  status: 'pending' | 'answered' | 'validated' | 'rejected';
  expertId?: string;
  validatorId?: string;
  answer?: string;
  validation?: {
    validatorId: string;
    status: 'approved' | 'rejected';
    feedback?: string;
  };
}

// Mock data for the feed
const feedItems: FeedItem[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    question: 'What are the best practices for React Native performance optimization?',
    likes: 24,
    comments: 8,
    timeAgo: '2h',
    tags: ['react-native', 'performance', 'mobile'],
    emotions: ['curious', 'excited'],
    skillLevel: 'expert',
    earnings: 150,
  },
  {
    id: '2',
    author: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    question: 'How do you handle state management in large-scale applications?',
    likes: 18,
    comments: 5,
    timeAgo: '4h',
    tags: ['state-management', 'architecture'],
    emotions: ['focused', 'determined'],
    skillLevel: 'intermediate',
    earnings: 75,
  },
];

const suggestedTags = [
  'react-native',
  'javascript',
  'typescript',
  'mobile',
  'performance',
  'architecture',
  'state-management',
  'ui-design',
  'backend',
  'database',
];

// Mock experts data
const experts: Expert[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    expertise: ['react-native', 'performance', 'mobile'],
    rating: 4.8,
    currentQuestions: 2,
    maxQuestions: 5,
    validationCount: 150,
    points: 1250,
    level: 13,
    totalAnswers: 45,
    totalValidations: 150,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    expertise: ['state-management', 'architecture'],
    rating: 4.5,
    currentQuestions: 1,
    maxQuestions: 5,
    validationCount: 120,
    points: 850,
    level: 9,
    totalAnswers: 32,
    totalValidations: 120,
  },
];

// Mock questions data
const questions: Question[] = [
  {
    id: '1',
    title: 'What are the best practices for React Native performance optimization?',
    description: 'I\'m experiencing slow rendering in my React Native app...',
    tags: ['react-native', 'performance', 'mobile'],
    emotions: ['curious', 'excited'],
    status: 'pending',
  },
  {
    id: '2',
    title: 'How do you handle state management in large-scale applications?',
    description: 'We\'re building a large application and need advice...',
    tags: ['state-management', 'architecture'],
    emotions: ['focused', 'determined'],
    status: 'answered',
    expertId: '1',
    answer: 'Here are the best practices...',
    validation: {
      validatorId: '2',
      status: 'approved',
      feedback: 'Great answer, very comprehensive!',
    },
  },
];

// Points calculation constants
const POINTS_PER_ANSWER = 25;
const POINTS_PER_VALIDATION = 10;
const POINTS_FOR_APPROVED_ANSWER = 50;
const POINTS_PER_LEVEL = 100;

export default function TabView({ onLogout, username }: TabViewProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('home');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [answer, setAnswer] = useState('');

  const emotions = [
    'curious', 'excited', 'focused', 'determined', 'confused',
    'frustrated', 'inspired', 'motivated', 'challenged', 'grateful'
  ];

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const findExpertForQuestion = (question: Question): Expert | null => {
    // First try to find an expert with matching expertise and available slots
    const primaryExpert = experts.find(expert => 
      expert.expertise.some(tag => question.tags.includes(tag)) &&
      expert.currentQuestions < expert.maxQuestions &&
      expert.rating >= 4.5
    );

    if (primaryExpert) {
      return primaryExpert;
    }

    // If no primary expert found, look for a secondary expert
    const secondaryExpert = experts.find(expert =>
      expert.expertise.some(tag => question.tags.includes(tag)) &&
      expert.currentQuestions < expert.maxQuestions &&
      expert.rating >= 4.0
    );

    return secondaryExpert || null;
  };

  const handleSubmitQuestion = () => {
    if (!questionTitle || !questionDescription) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      title: questionTitle,
      description: questionDescription,
      tags: selectedTags,
      emotions: selectedEmotions,
      status: 'pending',
    };

    const expert = findExpertForQuestion(newQuestion);
    
    if (expert) {
      // Update expert's current questions count
      const updatedExpert = {
        ...expert,
        currentQuestions: expert.currentQuestions + 1,
      };
      
      // In a real app, this would be an API call
      console.log('Question assigned to expert:', updatedExpert);
      
      // Reset form
      setQuestionTitle('');
      setQuestionDescription('');
      setSelectedTags([]);
      setSelectedEmotions([]);
      
      // Show success message
      Alert.alert(
        'Question Submitted',
        `Your question has been assigned to ${expert.name}`,
        [{ text: 'OK', onPress: () => setActiveTab('home') }]
      );
    } else {
      Alert.alert(
        'No Expert Available',
        'We couldn\'t find an available expert for your question. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const calculateLevel = (points: number): number => {
    return Math.floor(points / POINTS_PER_LEVEL) + 1;
  };

  const calculatePointsToNextLevel = (points: number): number => {
    const currentLevel = calculateLevel(points);
    const pointsForNextLevel = currentLevel * POINTS_PER_LEVEL;
    return pointsForNextLevel - points;
  };

  const awardPoints = (expertId: string, action: 'answer' | 'validation' | 'approved'): void => {
    const expert = experts.find(e => e.id === expertId);
    if (!expert) return;

    let pointsToAdd = 0;
    switch (action) {
      case 'answer':
        pointsToAdd = POINTS_PER_ANSWER;
        expert.totalAnswers += 1;
        break;
      case 'validation':
        pointsToAdd = POINTS_PER_VALIDATION;
        expert.totalValidations += 1;
        break;
      case 'approved':
        pointsToAdd = POINTS_FOR_APPROVED_ANSWER;
        break;
    }

    const oldLevel = expert.level;
    expert.points += pointsToAdd;
    expert.level = calculateLevel(expert.points);

    // Check for level up
    if (expert.level > oldLevel) {
      Alert.alert(
        'Level Up! 🎉',
        `${expert.name} has reached level ${expert.level}!`,
        [{ text: 'Awesome!' }]
      );
    }
  };

  const handleAnswerQuestion = (questionId: string) => {
    if (!answer.trim() || !selectedExpert) return;

    // Award points for answering
    awardPoints(selectedExpert.id, 'answer');

    // Find a validator
    const validator = experts.find(expert => 
      expert.id !== selectedExpert.id &&
      expert.expertise.some(tag => currentQuestion?.tags.includes(tag))
    );

    if (validator) {
      // Update question status
      const updatedQuestion = {
        ...currentQuestion,
        status: 'answered',
        answer,
        expertId: selectedExpert.id,
        validatorId: validator.id,
      };

      console.log('Question sent for validation to:', validator.name);
      
      // Reset form
      setAnswer('');
      setCurrentQuestion(null);
      setSelectedExpert(null);
      
      Alert.alert(
        'Answer Submitted',
        'Your answer has been sent for validation.',
        [{ text: 'OK', onPress: () => setActiveTab('home') }]
      );
    }
  };

  const handleValidation = (questionId: string, validatorId: string, status: 'approved' | 'rejected') => {
    const question = questions.find(q => q.id === questionId);
    if (!question || !question.expertId) return;

    // Award points for validation
    awardPoints(validatorId, 'validation');

    // If approved, award additional points to the answerer
    if (status === 'approved') {
      awardPoints(question.expertId, 'approved');
    }

    // Update question validation status
    question.validation = {
      validatorId,
      status,
      feedback: status === 'approved' ? 'Great answer!' : 'Needs improvement',
    };
  };

  const renderQuestionValidation = (question: Question) => {
    if (question.status !== 'answered' || !question.validation) return null;

    return (
      <View style={styles.validationContainer}>
        <Text style={styles.validationTitle}>Validation Status</Text>
        <View style={[
          styles.validationBadge,
          question.validation.status === 'approved' ? styles.approvedBadge : styles.rejectedBadge
        ]}>
          <Text style={styles.validationText}>
            {question.validation.status === 'approved' ? 'Approved' : 'Rejected'}
          </Text>
        </View>
        {question.validation.feedback && (
          <Text style={styles.validationFeedback}>{question.validation.feedback}</Text>
        )}
      </View>
    );
  };

  const renderExpertStats = (expert: Expert) => {
    const pointsToNextLevel = calculatePointsToNextLevel(expert.points);
    
    return (
      <View style={styles.expertStatsContainer}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {expert.level}</Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{expert.points} points</Text>
          <Text style={styles.nextLevelText}>
            {pointsToNextLevel} points to next level
          </Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{expert.totalAnswers}</Text>
            <Text style={styles.statLabel}>Answers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{expert.totalValidations}</Text>
            <Text style={styles.statLabel}>Validations</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{expert.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFeedItem = (item: FeedItem) => {
    const isLiked = likedPosts.includes(item.id);
    const question = questions.find(q => q.id === item.id);
    const expert = question?.expertId ? experts.find(e => e.id === question.expertId) : null;
    
    const getSkillBadgeStyle = (level: SkillLevel) => {
      switch (level) {
        case 'expert':
          return styles.expertBadge;
        case 'intermediate':
          return styles.intermediateBadge;
        case 'beginner':
          return styles.beginnerBadge;
        default:
          return {};
      }
    };
    
    return (
      <View key={item.id} style={styles.feedItem}>
        <View style={styles.feedHeader}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.feedHeaderText}>
            <View style={styles.authorRow}>
              <Text style={styles.authorName}>{item.author}</Text>
              {expert && (
                <View style={[styles.skillBadge, getSkillBadgeStyle(item.skillLevel)]}>
                  <Text style={styles.skillText}>Level {expert.level}</Text>
                </View>
              )}
            </View>
            <Text style={styles.timeAgo}>{item.timeAgo}</Text>
          </View>
          <View style={styles.earningsBadge}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={styles.earningsText}>{item.earnings}</Text>
          </View>
        </View>
        
        <Text style={styles.questionText}>{item.question}</Text>
        
        {expert && renderExpertStats(expert)}
        
        <View style={styles.emotionsContainer}>
          {item.emotions.map(emotion => (
            <View key={emotion} style={styles.emotionTag}>
              <Text style={styles.emotionText}>{emotion}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {question && renderQuestionValidation(question)}

        <View style={styles.interactionBar}>
          <TouchableOpacity 
            style={styles.interactionButton}
            onPress={() => toggleLike(item.id)}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={isLiked ? "#ef4444" : "#64748b"} 
            />
            <Text style={[styles.interactionText, isLiked && styles.likedText]}>
              {isLiked ? item.likes + 1 : item.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interactionButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#64748b" />
            <Text style={styles.interactionText}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interactionButton}>
            <Ionicons name="share-outline" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.feedHeader}>
              <Text style={styles.feedTitle}>Recent Questions</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="options-outline" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            {feedItems.map(renderFeedItem)}
          </View>
        );
      case 'discover':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search questions, topics, or users..."
                placeholderTextColor="#94a3b8"
              />
            </View>
            <Text style={styles.sectionTitle}>Trending Topics</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingContainer}>
              {suggestedTags.map(tag => (
                <TouchableOpacity key={tag} style={styles.trendingTag}>
                  <Text style={styles.trendingTagText}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            {feedItems.map(renderFeedItem)}
          </View>
        );
      case 'ask':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Ask a Question</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#94a3b8"
              value={questionTitle}
              onChangeText={setQuestionTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              value={questionDescription}
              onChangeText={setQuestionDescription}
            />

            <Text style={styles.sectionTitle}>How are you feeling?</Text>
            <View style={styles.emotionsContainer}>
              {emotions.map(emotion => (
                <TouchableOpacity
                  key={emotion}
                  style={[
                    styles.emotionTag,
                    selectedEmotions.includes(emotion) && styles.selectedEmotionTag,
                  ]}
                  onPress={() => toggleEmotion(emotion)}
                >
                  <Text style={[
                    styles.emotionText,
                    selectedEmotions.includes(emotion) && styles.selectedEmotionText,
                  ]}>
                    {emotion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Add Tags</Text>
            <View style={styles.tagsContainer}>
              {suggestedTags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tag,
                    selectedTags.includes(tag) && styles.selectedTag,
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.selectedTagText,
                  ]}>
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.askFooter}>
              <TouchableOpacity 
                style={[
                  styles.button,
                  (!questionTitle || !questionDescription) && styles.buttonDisabled,
                ]}
                onPress={handleSubmitQuestion}
                disabled={!questionTitle || !questionDescription}
              >
                <Text style={styles.buttonText}>Submit Question</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'groups':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.groupsHeader}>
              <Text style={styles.sectionTitle}>Your Groups</Text>
              <TouchableOpacity style={styles.createGroupButton}>
                <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
                <Text style={styles.createGroupText}>Create Group</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.emptyGroups}>
              <Ionicons name="people-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyGroupsText}>Join or create a group to start collaborating</Text>
            </View>
          </View>
        );
      case 'profile':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.profileHeader}>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{username}</Text>
                <Text style={styles.profileStats}>Member since 2024</Text>
              </View>
            </View>
            
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Answers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Reputation</Text>
              </View>
            </View>

            <View style={styles.earningsSection}>
              <Text style={styles.sectionTitle}>Your Earnings</Text>
              <View style={styles.earningsCard}>
                <View style={styles.earningsRow}>
                  <View>
                    <Text style={styles.earningsLabel}>Total Earned</Text>
                    <Text style={styles.earningsAmount}>0 points</Text>
                  </View>
                  <View style={styles.earningsIcon}>
                    <Ionicons name="star" size={24} color="#f59e0b" />
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={onLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
      
      <View style={[styles.tabBar, { paddingBottom: insets.bottom + 8 }]}>
        {tabs.map(({ key, label, icon, activeIcon, badge }) => (
          <TouchableOpacity
            key={key}
            style={styles.tab}
            onPress={() => setActiveTab(key)}
          >
            <View>
              <Ionicons
                name={activeTab === key ? activeIcon : icon}
                size={24}
                color={activeTab === key ? '#3b82f6' : '#64748b'}
              />
              {badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === key && styles.activeTabText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#0f172a',
  },
  input: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 15,
    color: '#0f172a',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
  },
  filterButton: {
    padding: 8,
  },
  feedItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  feedHeaderText: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  timeAgo: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  questionText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    marginVertical: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#475569',
  },
  interactionBar: {
    flexDirection: 'row',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  interactionText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  likedText: {
    color: '#ef4444',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 12,
  },
  selectedTag: {
    backgroundColor: '#3b82f6',
  },
  selectedTagText: {
    color: '#ffffff',
  },
  askFooter: {
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  profileHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    marginHorizontal: 20,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#0f172a',
  },
  trendingContainer: {
    marginBottom: 24,
  },
  trendingTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  trendingTagText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 16,
  },
  emotionTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedEmotionTag: {
    backgroundColor: '#3b82f6',
  },
  emotionText: {
    fontSize: 13,
    color: '#475569',
  },
  selectedEmotionText: {
    color: '#ffffff',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  expertBadge: {
    backgroundColor: '#dcfce7',
  },
  intermediateBadge: {
    backgroundColor: '#fef9c3',
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  earningsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  earningsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 4,
  },
  groupsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createGroupText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyGroups: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyGroupsText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
  },
  earningsSection: {
    marginTop: 24,
  },
  earningsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 4,
  },
  earningsIcon: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  beginnerBadge: {
    backgroundColor: '#e0f2fe',
  },
  validationContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  validationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  approvedBadge: {
    backgroundColor: '#dcfce7',
  },
  rejectedBadge: {
    backgroundColor: '#fee2e2',
  },
  validationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  validationFeedback: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  expertStatsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  levelBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  pointsContainer: {
    marginBottom: 12,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  nextLevelText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
}); 