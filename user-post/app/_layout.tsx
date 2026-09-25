import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {Stack, useRouter, useSegments} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {AuthProvider, useAuth} from "@/app/src/context/AuthContext";
import {useEffect} from "react";



function NavigationGuard() {
  const {token, isLoadingSession} = useAuth();
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
      if(isLoadingSession) return

    // DETECTAMOS SI ESTOY SITUADO EN PAGINAS PROTEGIDAS
      const inProctedScreen = segments[0] === "(protected)"

    if(token){
        console.log("USUARIO LOGUEADO", token)

        if(!inProctedScreen){
            router.replace("/(protected)/dashboard")
        }
    }else{
        if(inProctedScreen){
            console.log("USUARIO NO LOGUEADO")
            router.replace("/(public)")
        }
    }
  }, [token, isLoadingSession, segments]);
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='(public)' />
        <Stack.Screen name='(protected)' />
    </Stack>
  );
}


export default function RootLayout() {
    return(
    <AuthProvider>
        <NavigationGuard />
    </AuthProvider>
    )
}