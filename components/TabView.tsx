import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabViewProps {
  onLogout: () => void;
  username: string;
}

type IconName = 'home' | 'home-outline' | 'compass' | 'compass-outline' | 'add-circle' | 'add-circle-outline' | 'people' | 'people-outline' | 'person' | 'person-outline' | 'star' | 'heart' | 'heart-outline' | 'chatbubble-outline' | 'share-outline' | 'search' | 'options-outline' | 'log-out-outline' | 'arrow-back' | 'help-circle-outline' | 'download-outline' | 'trash-outline';

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
  user_sub: string;
  user_name: string;
  question_text: string;
  created_at: string;
  status: 'pending' | 'answered' | 'validated' | 'rejected' | 'approved';
  answered_by?: string;
  answerer_name?: string;
  answer_text?: string;
  answered_at?: string;
  tags: string[];
  emotions: string[];
}

interface Expertise {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  yearsOfExperience: number;
  certifications?: string[];
}

interface Activity {
  id: string;
  type: 'question' | 'answer' | 'validation' | 'points';
  title: string;
  description: string;
  date: string;
  points?: number;
}

interface SecuritySession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
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
  {
    id: '3',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=3',
    expertise: ['javascript', 'typescript'],
    rating: 4.7,
    currentQuestions: 0,
    maxQuestions: 5,
    validationCount: 200,
    points: 1500,
    level: 15,
    totalAnswers: 60,
    totalValidations: 200,
  }
];

// Mock questions data
const questions: Question[] = [
  {
    id: '1',
    user_sub: '1',
    user_name: 'Sarah Chen',
    question_text: 'What are the best practices for React Native performance optimization?',
    created_at: '2024-04-01T12:00:00',
    status: 'pending',
    tags: ['react-native', 'performance', 'mobile'],
    emotions: ['curious', 'excited'],
  },
  {
    id: '2',
    user_sub: '2',
    user_name: 'Mike Johnson',
    question_text: 'How do you handle state management in large-scale applications?',
    created_at: '2024-04-02T14:00:00',
    status: 'answered',
    answered_by: '1',
    answerer_name: 'Sarah Chen',
    answer_text: 'Here are the best practices...',
    answered_at: '2024-04-02T15:00:00',
    tags: ['state-management', 'architecture'],
    emotions: ['focused', 'determined'],
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
  const [viewedProfile, setViewedProfile] = useState<Expert | null>(null);
  const [expandedTags, setExpandedTags] = useState<{[key: string]: boolean}>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [expertise, setExpertise] = useState<Expertise[]>([
    { id: '1', name: 'React Native', level: 'expert', yearsOfExperience: 3 },
    { id: '2', name: 'TypeScript', level: 'intermediate', yearsOfExperience: 2 }
  ]);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'answer',
      title: 'Answered a question about React Native',
      description: 'Provided detailed explanation about performance optimization',
      date: '2024-03-15T10:30:00',
      points: 25
    },
    {
      id: '2',
      type: 'validation',
      title: 'Validated an answer',
      description: 'Reviewed and approved a technical solution',
      date: '2024-03-14T15:45:00',
      points: 10
    }
  ]);
  const [sessions, setSessions] = useState<SecuritySession[]>([
    {
      id: '1',
      device: 'iPhone 13',
      location: 'San Francisco, CA',
      lastActive: '2024-03-15T10:30:00',
      isCurrent: true
    },
    {
      id: '2',
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      lastActive: '2024-03-14T15:45:00',
      isCurrent: false
    }
  ]);
  const [preferences, setPreferences] = useState({
    preferredTopics: ['react-native', 'typescript', 'mobile-development'],
    language: 'en',
    timezone: 'America/Los_Angeles',
    theme: 'light'
  });

  const QUESTIONS_PER_PAGE = 10;

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

  const toggleTags = (itemId: string) => {
    setExpandedTags(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
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
      user_sub: '1',
      user_name: 'Sarah Chen',
      question_text: questionTitle,
      created_at: new Date().toISOString(),
      status: 'pending',
      tags: selectedTags,
      emotions: selectedEmotions,
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
        answered_by: selectedExpert.id,
        answerer_name: selectedExpert.name,
        answer_text: answer,
        answered_at: new Date().toISOString(),
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
    if (!question || !question.answered_by) return;

    // Award points for validation
    awardPoints(validatorId, 'validation');

    // If approved, award additional points to the answerer
    if (status === 'approved') {
      awardPoints(question.answered_by, 'approved');
    }

    // Update question validation status
    question.status = status === 'approved' ? 'validated' : 'rejected';
  };

  const renderQuestionValidation = (question: Question) => {
    if (question.status !== 'validated' && question.status !== 'rejected') return null;

    return (
      <View style={styles.validationContainer}>
        <View style={[
          styles.validationBadge,
          question.status === 'validated' ? styles.approvedBadge : styles.rejectedBadge
        ]}>
          <Text style={styles.validationText}>
            {question.status === 'validated' ? 'Approved' : 'Rejected'}
          </Text>
        </View>
        {question.answer_text && (
          <Text style={styles.validationFeedback}>{question.answer_text}</Text>
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

  const handleViewProfile = (userId: string) => {
    const expert = experts.find(e => e.id === userId);
    if (expert) {
      setViewedProfile(expert);
      setActiveTab('profile');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format time as HH:MM AM/PM
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${time}`;
    }
    
    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${time}`;
    }

    // For other dates, show the date and time
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ` at ${time}`;
  };

  const renderFeedItem = (item: FeedItem) => {
    const question = questions.find(q => q.id === item.id);
    if (!question) return null;

    const isTagsExpanded = expandedTags[item.id];

    return (
      <View key={item.id} style={styles.feedItem}>
        <View style={styles.feedItemHeader}>
          <TouchableOpacity 
            style={styles.authorInfo}
            onPress={() => handleViewProfile(question.user_sub)}
          >
            <Image
              source={{ uri: item.avatar }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.authorName}>{question.user_name || 'Anonymous'}</Text>
              <Text style={styles.timeAgo}>
                {formatDate(question.created_at)}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="options-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.questionText}>{question.question_text}</Text>

        {question.status === 'answered' && question.answer_text && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerLabel}>Answer:</Text>
            <Text style={styles.answerText}>{question.answer_text}</Text>
            <TouchableOpacity 
              onPress={() => handleViewProfile(question.answered_by || '')}
            >
              <Text style={styles.answererName}>
                Answered by: {question.answerer_name || 'Anonymous'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={styles.tagsHeader}
          onPress={() => toggleTags(item.id)}
        >
          <View style={styles.colorStrip}>
            <View style={[styles.colorSegment, styles.redSegment]} />
            <View style={[styles.colorSegment, styles.greenSegment]} />
            <View style={[styles.colorSegment, styles.blueSegment]} />
          </View>
          <Ionicons 
            name={isTagsExpanded ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color="#64748b" 
            style={styles.expandIcon}
          />
        </TouchableOpacity>

        {isTagsExpanded && (
          <>
            <View style={styles.tagsContainer}>
              {question.tags?.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.emotionsContainer}>
              {question.emotions?.map((emotion, index) => (
                <View key={index} style={styles.emotion}>
                  <Text style={styles.emotionText}>{emotion}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.feedItemFooter}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getPaginatedQuestions = () => {
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;
    return feedItems.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(feedItems.length / QUESTIONS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
          onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? '#cbd5e1' : '#64748b'} />
        </TouchableOpacity>
        
        <Text style={styles.paginationText}>
          Page {currentPage} of {totalPages}
        </Text>

        <TouchableOpacity 
          style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
          onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? '#cbd5e1' : '#64748b'} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.feedHeader}>
              <View>
                <Text style={styles.feedTitle}>Your Questions</Text>
                <Text style={styles.feedSubtitle}>
                  {feedItems.length} {feedItems.length === 1 ? 'question' : 'questions'} answered
                </Text>
              </View>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="options-outline" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            {feedItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="help-circle-outline" size={48} color="#94a3b8" />
                <Text style={styles.emptyStateTitle}>No Questions Yet</Text>
                <Text style={styles.emptyStateText}>
                  Your answered questions will appear here. Tap the Ask tab to get started!
                </Text>
              </View>
            ) : (
              <>
                {getPaginatedQuestions().map(renderFeedItem)}
                {renderPagination()}
              </>
            )}
          </View>
        );
      case 'discover':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search your questions..."
                placeholderTextColor="#94a3b8"
              />
            </View>
            <Text style={styles.sectionTitle}>Your Topics</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingContainer}>
              {suggestedTags.map(tag => (
                <TouchableOpacity key={tag} style={styles.trendingTag}>
                  <Text style={styles.trendingTagText}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.sectionTitle}>Your Answered Questions</Text>
            {feedItems.map(renderFeedItem)}
          </View>
        );
      case 'ask':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Ask Anonymously</Text>
            <Text style={styles.subtitle}>
              Your question will be answered by a verified expert. Your identity remains private.
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="What would you like to know?"
              placeholderTextColor="#94a3b8"
              value={questionTitle}
              onChangeText={setQuestionTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add more details to help experts understand your question better..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              value={questionDescription}
              onChangeText={setQuestionDescription}
            />

            <Text style={styles.sectionTitle}>How are you feeling?</Text>
            <Text style={styles.sectionSubtitle}>
              This helps us match you with the right expert
            </Text>
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

            <Text style={styles.sectionTitle}>Add Topics</Text>
            <Text style={styles.sectionSubtitle}>
              Select relevant topics to help experts find your question
            </Text>
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
        // If no profile data is found, create a default profile for the current user
        const defaultProfile: Expert = {
          id: 'current-user',
          name: username || 'Anonymous',
          avatar: 'https://i.pravatar.cc/150?img=4',
          expertise: ['general'],
          rating: 0,
          currentQuestions: 0,
          maxQuestions: 5,
          validationCount: 0,
          points: 0,
          level: 1,
          totalAnswers: 0,
          totalValidations: 0,
        };

        const profileData = viewedProfile || experts.find(e => e.name === username) || defaultProfile;
        console.log('Profile Data:', profileData);
        console.log('Username:', username);
        console.log('Viewed Profile:', viewedProfile);

        return (
          <ScrollView style={styles.profileContainer}>
            <View style={styles.profileContent}>
              {viewedProfile && (
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => {
                    setViewedProfile(null);
                    setActiveTab('home');
                  }}
                >
                  <Ionicons name="arrow-back" size={24} color="#64748b" />
                  <Text style={styles.backButtonText}>Back to Feed</Text>
                </TouchableOpacity>
              )}
              <View style={styles.profileHeader}>
                <View style={styles.profileInfo}>
                  <Image
                    source={{ uri: profileData.avatar }}
                    style={styles.profileAvatar}
                  />
                  <Text style={styles.profileName}>{profileData.name}</Text>
                  <Text style={styles.profileStats}>Level {profileData.level} Expert</Text>
                </View>
              </View>
              
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profileData.totalAnswers}</Text>
                  <Text style={styles.statLabel}>Answers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profileData.totalValidations}</Text>
                  <Text style={styles.statLabel}>Validations</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profileData.rating.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>

              <View style={styles.earningsSection}>
                <Text style={styles.sectionTitle}>Expert Stats</Text>
                <View style={styles.earningsCard}>
                  <View style={styles.earningsRow}>
                    <View>
                      <Text style={styles.earningsLabel}>Total Points</Text>
                      <Text style={styles.earningsAmount}>{profileData.points} points</Text>
                    </View>
                    <View style={styles.earningsIcon}>
                      <Ionicons name="star" size={24} color="#f59e0b" />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Expertise Management</Text>
                <View style={styles.settingCard}>
                  {expertise.map((item) => (
                    <View key={item.id} style={styles.expertiseItem}>
                      <View style={styles.expertiseInfo}>
                        <Text style={styles.expertiseName}>{item.name}</Text>
                        <View style={styles.expertiseDetails}>
                          <Text style={styles.expertiseLevel}>{item.level}</Text>
                          <Text style={styles.expertiseYears}>{item.yearsOfExperience} years</Text>
                        </View>
                        {item.certifications?.map((cert, index) => (
                          <Text key={index} style={styles.certification}>{cert}</Text>
                        ))}
                      </View>
                      <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="pencil" size={20} color="#3b82f6" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
                    <Text style={styles.addButtonText}>Add Expertise</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Activity History</Text>
                <View style={styles.settingCard}>
                  {activities.map((activity) => (
                    <View key={activity.id} style={styles.activityItem}>
                      <View style={styles.activityIcon}>
                        <Ionicons 
                          name={
                            activity.type === 'question' ? 'help-circle' :
                            activity.type === 'answer' ? 'chatbubble' :
                            activity.type === 'validation' ? 'checkmark-circle' :
                            'star'
                          } 
                          size={24} 
                          color="#3b82f6" 
                        />
                      </View>
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                        <Text style={styles.activityDescription}>{activity.description}</Text>
                        <Text style={styles.activityDate}>{formatDate(activity.date)}</Text>
                      </View>
                      {activity.points && (
                        <View style={styles.pointsBadge}>
                          <Text style={styles.pointsText}>+{activity.points}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.settingCard}>
                  <View style={styles.preferenceItem}>
                    <Text style={styles.preferenceLabel}>Preferred Topics</Text>
                    <View style={styles.tagsContainer}>
                      {preferences.preferredTopics.map((topic, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>#{topic}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.preferenceItem}>
                    <Text style={styles.preferenceLabel}>Language</Text>
                    <TouchableOpacity style={styles.selectButton}>
                      <Text style={styles.selectButtonText}>English</Text>
                      <Ionicons name="chevron-down" size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.preferenceItem}>
                    <Text style={styles.preferenceLabel}>Timezone</Text>
                    <TouchableOpacity style={styles.selectButton}>
                      <Text style={styles.selectButtonText}>America/Los_Angeles</Text>
                      <Ionicons name="chevron-down" size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.preferenceItem}>
                    <Text style={styles.preferenceLabel}>Theme</Text>
                    <TouchableOpacity style={styles.selectButton}>
                      <Text style={styles.selectButtonText}>Light</Text>
                      <Ionicons name="chevron-down" size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Security</Text>
                <View style={styles.settingCard}>
                  <View style={styles.securityItem}>
                    <View>
                      <Text style={styles.securityTitle}>Two-Factor Authentication</Text>
                      <Text style={styles.securityDescription}>Add an extra layer of security to your account</Text>
                    </View>
                    <Switch
                      value={false}
                      onValueChange={() => {}}
                      trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                      thumbColor="#ffffff"
                    />
                  </View>
                  <View style={styles.securityItem}>
                    <Text style={styles.securityTitle}>Active Sessions</Text>
                    {sessions.map((session) => (
                      <View key={session.id} style={styles.sessionItem}>
                        <View style={styles.sessionInfo}>
                          <Text style={styles.sessionDevice}>{session.device}</Text>
                          <Text style={styles.sessionDetails}>
                            {session.location} • {formatDate(session.lastActive)}
                          </Text>
                        </View>
                        {session.isCurrent ? (
                          <View style={styles.currentSession}>
                            <Text style={styles.currentSessionText}>Current</Text>
                          </View>
                        ) : (
                          <TouchableOpacity style={styles.endSessionButton}>
                            <Text style={styles.endSessionText}>End Session</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Data & Privacy</Text>
                <View style={styles.settingCard}>
                  <TouchableOpacity style={styles.dataItem}>
                    <Ionicons name="download-outline" size={24} color="#3b82f6" />
                    <View style={styles.dataInfo}>
                      <Text style={styles.dataTitle}>Export Data</Text>
                      <Text style={styles.dataDescription}>Download a copy of your data</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#64748b" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dataItem}>
                    <Ionicons name="trash-outline" size={24} color="#ef4444" />
                    <View style={styles.dataInfo}>
                      <Text style={styles.dataTitle}>Delete Account</Text>
                      <Text style={styles.dataDescription}>Permanently delete your account and data</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              {!viewedProfile && (
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={onLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
  },
  feedSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
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
  profileContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  profileContent: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
  earningsSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  earningsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
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
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
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
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  paginationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paginationButtonDisabled: {
    backgroundColor: '#f1f5f9',
    shadowOpacity: 0,
  },
  paginationText: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 16,
    fontWeight: '500',
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
    alignItems: 'center',
  },
  feedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  answererName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginTop: 12,
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  colorStrip: {
    flexDirection: 'row',
    height: 2,
    width: 60,
    borderRadius: 1,
    overflow: 'hidden',
  },
  colorSegment: {
    flex: 1,
  },
  redSegment: {
    backgroundColor: '#ef4444',
  },
  greenSegment: {
    backgroundColor: '#22c55e',
  },
  blueSegment: {
    backgroundColor: '#3b82f6',
  },
  expandIcon: {
    marginLeft: 8,
  },
  emotion: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  feedItemFooter: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 8,
    fontWeight: '500',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
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
  expertiseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  expertiseInfo: {
    flex: 1,
  },
  expertiseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  expertiseDetails: {
    flexDirection: 'row',
    marginTop: 4,
  },
  expertiseLevel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  expertiseYears: {
    fontSize: 14,
    color: '#64748b',
  },
  certification: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 4,
  },
  editButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    marginLeft: 8,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  activityDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  pointsBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  preferenceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#0f172a',
  },
  securityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  securityDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  sessionDetails: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  currentSession: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentSessionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  endSessionButton: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  endSessionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dataInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  dataDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
}); 