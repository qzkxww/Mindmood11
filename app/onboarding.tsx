import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Battery, BatteryLow, Zap, Sun, Activity, Users, Brain, Target, Clock, Coffee, Moon, Sunrise, Sparkles } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  runOnJS,
  interpolate,
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
  Layout,
  withRepeat,
  withSequence,
  withDelay
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const questions = [
  {
    question: "How do your energy levels usually feel?",
    subtitle: "This helps us personalize your experience",
    options: [
      { 
        text: "Low", 
        color: "#FF6B6B", 
        bgColor: "#FFF5F5", 
        icon: BatteryLow,
        description: "Often tired or drained"
      },
      { 
        text: "Medium", 
        color: "#FFD93D", 
        bgColor: "#FFFBEB", 
        icon: Battery,
        description: "Balanced energy levels"
      },
      { 
        text: "High", 
        color: "#6BCF7F", 
        bgColor: "#F0FDF4", 
        icon: Zap,
        description: "Energetic and motivated"
      }
    ]
  },
  {
    question: "What drains you most often?",
    subtitle: "Understanding your energy drains helps us provide better guidance",
    options: [
      { text: "Social interactions", icon: Users, color: "#8B5CF6", bgColor: "#F3F4F6" },
      { text: "Overthinking", icon: Brain, color: "#06B6D4", bgColor: "#F3F4F6" },
      { text: "Lack of structure", icon: Target, color: "#F59E0B", bgColor: "#F3F4F6" },
      { text: "Poor sleep", icon: Moon, color: "#6366F1", bgColor: "#F3F4F6" }
    ]
  },
  {
    question: "Which mood best describes you lately?",
    subtitle: "Your current emotional state helps us tailor your plan",
    options: [
      { text: "Anxious", icon: Activity, color: "#EF4444", bgColor: "#F3F4F6" },
      { text: "Unmotivated", icon: Battery, color: "#6B7280", bgColor: "#F3F4F6" },
      { text: "Irritable", icon: Zap, color: "#F97316", bgColor: "#F3F4F6" },
      { text: "Numb", icon: Moon, color: "#64748B", bgColor: "#F3F4F6" },
      { text: "Mixed", icon: Sun, color: "#8B5CF6", bgColor: "#F3F4F6" }
    ]
  },
  {
    question: "When are you most productive?",
    subtitle: "Knowing your peak hours helps optimize your daily routine",
    options: [
      { text: "Morning", icon: Sunrise, color: "#F59E0B", bgColor: "#F3F4F6" },
      { text: "Afternoon", icon: Sun, color: "#EAB308", bgColor: "#F3F4F6" },
      { text: "Night", icon: Moon, color: "#6366F1", bgColor: "#F3F4F6" }
    ]
  },
  {
    question: "What do you want to improve most?",
    subtitle: "Your primary goal will shape your personalized coaching plan",
    options: [
      { text: "Energy & focus", icon: Zap, color: "#10B981", bgColor: "#F3F4F6" },
      { text: "Emotional balance", icon: Activity, color: "#8B5CF6", bgColor: "#F3F4F6" },
      { text: "Motivation", icon: Target, color: "#F59E0B", bgColor: "#F3F4F6" },
      { text: "Stress levels", icon: Brain, color: "#06B6D4", bgColor: "#F3F4F6" }
    ]
  }
];

const planNames = [
  "Energy Recovery Plan",
  "Emotional Balance Plan", 
  "Focus & Clarity Plan",
  "Stress Relief Plan",
  "Motivation Builder Plan"
];

const loadingMessages = [
  "Finalizing your results…",
  "Aligning your mood blueprint…",
  "Analyzing your emotional patterns…",
  "Building your personalized plan…",
  "Almost done…"
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Animation values for smooth transitions
  const contentOpacity = useSharedValue(1);
  const contentTranslateY = useSharedValue(0);
  const questionScale = useSharedValue(1);
  
  // Loading screen animations
  const loadingProgress = useSharedValue(0);
  const messageOpacity = useSharedValue(1);
  const loadingScale = useSharedValue(0.9);
  
  // Sparkle animations
  const sparkle1Opacity = useSharedValue(0);
  const sparkle2Opacity = useSharedValue(0);
  const sparkle3Opacity = useSharedValue(0);
  const sparkle4Opacity = useSharedValue(0);
  const sparkle5Opacity = useSharedValue(0);
  const sparkle6Opacity = useSharedValue(0);

  // Visual design animations
  const pulseScale = useSharedValue(1);
  const coreGlow = useSharedValue(0);
  const particle1Rotation = useSharedValue(0);
  const particle2Rotation = useSharedValue(0);
  const particle3Float = useSharedValue(0);
  const particle4Float = useSharedValue(0);

  // Initialize entrance animation
  useEffect(() => {
    contentOpacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
    
    contentTranslateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });

    // Start visual design animations
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    coreGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    particle1Rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );

    particle2Rotation.value = withRepeat(
      withTiming(-360, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );

    particle3Float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    particle4Float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  // Loading screen animations
  useEffect(() => {
    if (showLoading) {
      // Scale in the loading container
      loadingScale.value = withSpring(1, {
        damping: 20,
        stiffness: 90,
      });

      // Start smooth progress bar animation (5.5 seconds with easing)
      loadingProgress.value = withTiming(1, {
        duration: 5500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Smooth easing curve
      });

      // Sparkle animations with staggered timing
      const sparkleAnimations = [
        sparkle1Opacity,
        sparkle2Opacity,
        sparkle3Opacity,
        sparkle4Opacity,
        sparkle5Opacity,
        sparkle6Opacity
      ];

      sparkleAnimations.forEach((sparkle, index) => {
        sparkle.value = withDelay(
          index * 300,
          withRepeat(
            withSequence(
              withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) }),
              withTiming(0.2, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
              withTiming(0.8, { duration: 1200, easing: Easing.in(Easing.ease) })
            ),
            -1,
            false
          )
        );
      });

      // Message cycling animation
      const messageInterval = setInterval(() => {
        messageOpacity.value = withTiming(0, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }, () => {
          runOnJS(setCurrentMessageIndex)((prev) => 
            prev < loadingMessages.length - 1 ? prev + 1 : prev
          );
          messageOpacity.value = withTiming(1, {
            duration: 400,
            easing: Easing.inOut(Easing.ease),
          });
        });
      }, 1800);

      // Navigate to paywall after loading completes
      const navigationTimeout = setTimeout(() => {
        router.replace('/paywall');
      }, 6000);

      return () => {
        clearInterval(messageInterval);
        clearTimeout(navigationTimeout);
      };
    }
  }, [showLoading]);

  const handleOptionSelect = (option: string) => {
    if (isTransitioning) return;
    setSelectedOption(option);
    
    // Add a subtle selection animation
    questionScale.value = withSpring(0.98, {
      damping: 20,
      stiffness: 200,
    }, () => {
      questionScale.value = withSpring(1, {
        damping: 20,
        stiffness: 200,
      });
    });
  };

  const animateTransition = (callback: () => void) => {
    setIsTransitioning(true);
    
    // Smooth fade out with gentle slide up
    contentOpacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    
    contentTranslateY.value = withTiming(-20, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }, () => {
      // Execute the callback (change question)
      runOnJS(callback)();
      
      // Reset position for slide in from bottom
      contentTranslateY.value = 30;
      
      // Smooth fade in with gentle slide up
      contentOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
      
      contentTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      }, () => {
        runOnJS(setIsTransitioning)(false);
      });
    });
  };

  const handleNext = () => {
    if (!selectedOption || isTransitioning) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      animateTransition(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      });
    } else {
      // Quiz completed, show loading screen
      animateTransition(() => {
        setShowLoading(true);
      });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0 && !isTransitioning) {
      animateTransition(() => {
        setCurrentQuestion(currentQuestion - 1);
        setAnswers(answers.slice(0, -1));
        setSelectedOption(null);
      });
    }
  };

  // Animated styles
  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  const animatedQuestionStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: questionScale.value }],
    };
  });

  const animatedLoadingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: loadingScale.value }],
    };
  });

  const animatedProgressStyle = useAnimatedStyle(() => {
    const progressWidth = interpolate(loadingProgress.value, [0, 1], [0, 100]);
    return {
      width: `${progressWidth}%`,
    };
  });

  const animatedMessageStyle = useAnimatedStyle(() => {
    return {
      opacity: messageOpacity.value,
      transform: [{ translateY: interpolate(messageOpacity.value, [0, 1], [10, 0]) }],
    };
  });

  // Visual design animated styles
  const animatedCoreStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: interpolate(coreGlow.value, [0, 1], [0.7, 1]),
    };
  });

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value * 0.8 }],
      opacity: interpolate(coreGlow.value, [0, 1], [0.3, 0.6]),
    };
  });

  const animatedParticle1Style = useAnimatedStyle(() => {
    const translateX = interpolate(
      particle1Rotation.value,
      [0, 360],
      [0, 2 * Math.PI]
    );
    return {
      transform: [
        { translateX: Math.cos(translateX) * 50 },
        { translateY: Math.sin(translateX) * 50 },
        { scale: interpolate(particle1Rotation.value % 180, [0, 90, 180], [0.6, 1, 0.6]) }
      ],
    };
  });

  const animatedParticle2Style = useAnimatedStyle(() => {
    const translateX = interpolate(
      particle2Rotation.value,
      [-360, 0],
      [0, 2 * Math.PI]
    );
    return {
      transform: [
        { translateX: Math.cos(translateX) * 35 },
        { translateY: Math.sin(translateX) * 35 },
        { scale: interpolate(Math.abs(particle2Rotation.value) % 180, [0, 90, 180], [0.4, 0.8, 0.4]) }
      ],
    };
  });

  const animatedParticle3Style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(particle3Float.value, [0, 1], [0, -10]) },
        { scale: interpolate(particle3Float.value, [0, 1], [0.6, 1]) }
      ],
      opacity: interpolate(particle3Float.value, [0, 0.5, 1], [0.4, 0.8, 0.4]),
    };
  });

  const animatedParticle4Style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(particle4Float.value, [0, 1], [0, 8]) },
        { scale: interpolate(particle4Float.value, [0, 1], [0.8, 0.5]) }
      ],
      opacity: interpolate(particle4Float.value, [0, 0.5, 1], [0.6, 0.3, 0.6]),
    };
  });

  // Sparkle animated styles
  const createSparkleStyle = (sparkleOpacity: Animated.SharedValue<number>) => {
    return useAnimatedStyle(() => {
      return {
        opacity: sparkleOpacity.value,
        transform: [{ scale: sparkleOpacity.value }],
      };
    });
  };

  const sparkle1Style = createSparkleStyle(sparkle1Opacity);
  const sparkle2Style = createSparkleStyle(sparkle2Opacity);
  const sparkle3Style = createSparkleStyle(sparkle3Opacity);
  const sparkle4Style = createSparkleStyle(sparkle4Opacity);
  const sparkle5Style = createSparkleStyle(sparkle5Opacity);
  const sparkle6Style = createSparkleStyle(sparkle6Opacity);

  // Visual design component
  const VisualDesign = () => (
    <View style={styles.visualContainer}>
      <View style={styles.energyRing}>
        <View style={styles.middleRing}>
          <View style={styles.innerRing}>
            <Animated.View style={[styles.energyCore, animatedCoreStyle]}>
              <Animated.View style={[styles.energyPulse, animatedPulseStyle]} />
            </Animated.View>
          </View>
        </View>
      </View>
      
      {/* Floating particles */}
      <Animated.View style={[styles.particle, styles.particle1, animatedParticle1Style]} />
      <Animated.View style={[styles.particle, styles.particle2, animatedParticle2Style]} />
      <Animated.View style={[styles.particle, styles.particle3, animatedParticle3Style]} />
      <Animated.View style={[styles.particle, styles.particle4, animatedParticle4Style]} />
    </View>
  );

  // Loading screen component
  if (showLoading) {
    return (
      <View style={styles.loadingScreenContainer}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[styles.loadingContainer, animatedLoadingStyle]}>
            {/* Decorative sparkles */}
            <Animated.View style={[styles.sparkle, styles.sparkle1, sparkle1Style]}>
              <View style={styles.sparkleShape} />
            </Animated.View>
            <Animated.View style={[styles.sparkle, styles.sparkle2, sparkle2Style]}>
              <View style={styles.sparkleShape} />
            </Animated.View>
            <Animated.View style={[styles.sparkle, styles.sparkle3, sparkle3Style]}>
              <View style={styles.sparkleShape} />
            </Animated.View>
            <Animated.View style={[styles.sparkle, styles.sparkle4, sparkle4Style]}>
              <View style={styles.sparkleShape} />
            </Animated.View>
            <Animated.View style={[styles.sparkle, styles.sparkle5, sparkle5Style]}>
              <View style={styles.sparkleShape} />
            </Animated.View>
            <Animated.View style={[styles.sparkle, styles.sparkle6, sparkle6Style]}>
              <View style={styles.sparkleShape} />
            </Animated.View>

            <View style={styles.loadingContent}>
              <Text style={styles.loadingTitle}>Setting things{'\n'}up for you...</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <Animated.View style={[styles.progressBar, animatedProgressStyle]}>
                    <LinearGradient
                      colors={['#A855F7', '#06B6D4', '#10B981']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.progressGradient}
                    />
                  </Animated.View>
                </View>
              </View>
              
              <Animated.Text style={[styles.loadingMessage, animatedMessageStyle]}>
                {loadingMessages[currentMessageIndex]}
              </Animated.Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <LinearGradient colors={['#f8fafc', '#e2e8f0']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleBack} 
            style={[styles.backButton, { opacity: currentQuestion === 0 ? 0.3 : 1 }]}
            disabled={currentQuestion === 0 || isTransitioning}
          >
            <ChevronLeft size={24} color="#64748b" />
          </TouchableOpacity>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }
                ]}
                layout={Layout.springify().damping(20).stiffness(90)}
              />
            </View>
          </View>
        </View>

        {/* Visual Design Section */}
        <View style={styles.visualSection}>
          <VisualDesign />
        </View>

        <Animated.View style={[styles.contentContainer, animatedContentStyle]}>
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[styles.questionContainer, animatedQuestionStyle]}>
              <Text style={styles.questionText}>
                {currentQ.question}
              </Text>
              {currentQ.subtitle && (
                <Text style={styles.questionSubtitle}>
                  {currentQ.subtitle}
                </Text>
              )}
            </Animated.View>

            <View style={styles.optionsContainer}>
              {currentQ.options.map((option, index) => {
                const IconComponent = option.icon;
                const isSelected = selectedOption === option.text;
                const isEnergyQuestion = currentQuestion === 0;
                
                return (
                  <Animated.View
                    key={`${currentQuestion}-${index}`}
                    entering={FadeIn.delay(index * 120).duration(600).easing(Easing.out(Easing.cubic))}
                    layout={Layout.springify()}
                  >
                    <TouchableOpacity
                      style={[
                        styles.optionCard,
                        isSelected && styles.selectedOption,
                        isSelected && isEnergyQuestion && { 
                          borderColor: option.color,
                          backgroundColor: option.bgColor,
                          shadowColor: option.color,
                          shadowOpacity: 0.2,
                          shadowRadius: 8,
                          shadowOffset: { width: 0, height: 4 },
                          elevation: 8,
                        }
                      ]}
                      onPress={() => handleOptionSelect(option.text)}
                      activeOpacity={0.7}
                      disabled={isTransitioning}
                    >
                      <View style={styles.optionContent}>
                        <View style={[
                          styles.optionIconContainer,
                          isEnergyQuestion && { backgroundColor: option.bgColor },
                          isSelected && isEnergyQuestion && { backgroundColor: option.color + '20' }
                        ]}>
                          <IconComponent 
                            size={24} 
                            color={isSelected && isEnergyQuestion ? option.color : '#64748b'} 
                          />
                        </View>
                        <View style={styles.optionTextContainer}>
                          <Text style={[
                            styles.optionText,
                            isSelected && isEnergyQuestion && { color: option.color }
                          ]}>
                            {option.text}
                          </Text>
                          {isEnergyQuestion && option.description && (
                            <Text style={[
                              styles.optionDescription,
                              isSelected && { color: option.color + 'CC' }
                            ]}>
                              {option.description}
                            </Text>
                          )}
                        </View>
                      </View>
                      {isSelected && (
                        <Animated.View 
                          style={[
                            styles.selectedIndicator,
                            isEnergyQuestion && { backgroundColor: option.color }
                          ]}
                          entering={FadeIn.duration(200)}
                        >
                          <ChevronRight size={16} color="#ffffff" />
                        </Animated.View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              { opacity: selectedOption && !isTransitioning ? 1 : 0.5 }
            ]}
            onPress={handleNext}
            disabled={!selectedOption || isTransitioning}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
            <ChevronRight size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  progressBarContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  visualSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  visualContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  energyRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#3b82f620',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#3b82f640',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#3b82f660',
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyCore: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f680',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3b82f6',
  },
  particle1: {
    top: 15,
    right: 25,
  },
  particle2: {
    bottom: 20,
    left: 20,
  },
  particle3: {
    top: 40,
    left: 10,
  },
  particle4: {
    bottom: 40,
    right: 15,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  questionText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  questionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  selectedOption: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    transform: [{ scale: 1.02 }],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  nextButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  // Loading screen styles
  loadingScreenContainer: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    position: 'relative',
  },
  loadingContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  loadingTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
    textAlign: 'center',
    marginBottom: 64,
    lineHeight: 40,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 48,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
    borderRadius: 4,
  },
  loadingMessage: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#6366F1',
    textAlign: 'center',
    lineHeight: 24,
    minHeight: 24,
  },
  // Sparkle styles
  sparkle: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleShape: {
    width: 16,
    height: 16,
    backgroundColor: '#A855F7',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
    opacity: 0.6,
  },
  sparkle1: {
    top: '20%',
    left: '15%',
  },
  sparkle2: {
    top: '15%',
    right: '20%',
  },
  sparkle3: {
    top: '35%',
    right: '10%',
  },
  sparkle4: {
    bottom: '30%',
    left: '10%',
  },
  sparkle5: {
    bottom: '20%',
    right: '15%',
  },
  sparkle6: {
    bottom: '40%',
    right: '25%',
  },
});