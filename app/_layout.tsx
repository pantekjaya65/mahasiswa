import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomTabNavigationEventMap,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import HomeScreen from "../components/HomeScreen";
import FavoritScreen from "../components/FavoritScreen";
import KategoriScreen from "../components/AddKategoriScreen";
import ProfileScreen from "../components/ProfileScreen";
import DetailScreen from "../components/DetailScreen";
import LoginScreen from "../components/LoginScreen";
import RegisterScreen from "../components/RegisterScreen";
import ManajemenUserScreen from "../components/ManajemenUserScreen";

const { width } = Dimensions.get("window");

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  DetailScreen: { kisah: any };
  FavoritScreen: undefined;
};

type CustomTabBarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: {
    [key: string]: {
      options: any;
    };
  };
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
};

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.navBarContainer}>
      <View style={styles.navBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIconName = () => {
            switch (route.name) {
              case "Home":
                return "home";
              case "Favorit":
                return "heart";
              case "Kategori":
                return "albums";
              case "Profile":
                return "person";
              case "ManajemenUser":
                return "people";
              default:
                return "ellipse-outline";
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.tabButton, isFocused && styles.activeTab]}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={route.name}
            >
              <Ionicons
                name={getIconName()}
                size={25}
                color={isFocused ? "#FF6B6B" : "rgba(35, 35, 35, 0.8)"}
              />
              <Text style={[styles.tabText, isFocused && styles.activeText]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const TabNavigator: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("user");
        if (jsonValue) {
          const user = JSON.parse(jsonValue);
          setRole(user.role);
        }
      } catch (error) {
        console.error("Gagal mendapatkan role:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Beranda", title: "Beranda" }}
      />
      <Tab.Screen
        name="Favorit"
        component={FavoritScreen}
        options={{ tabBarLabel: "Favorit", title: "Favorit" }}
      />
      {role !== "user" && (
        <Tab.Screen
          name="Kategori"
          component={KategoriScreen}
          options={{ tabBarLabel: "Kategori", title: "Kategori" }}
        />
      )}
      {role !== "user" && (
        <Tab.Screen
          name="ManajemenUser"
          component={ManajemenUserScreen}
          options={{ tabBarLabel: "Kelola User", title: "Manajemen User" }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profil", title: "Profil" }}
      />
    </Tab.Navigator>
  );
};

const Layout: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="FavoritScreen" component={FavoritScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    backgroundColor: "white",
    width: "100%",
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  activeTab: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderRadius: 20,
  },
  tabText: {
    fontSize: 9,
    marginTop: 2,
    color: "rgba(0, 0, 0, 0.8)",
  },
  activeText: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
});

export default Layout;
