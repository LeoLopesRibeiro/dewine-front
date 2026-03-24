import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home.js';

const {Screen, Navigator} = createNativeStackNavigator();

export function StackRoutes(){
    return(
        <NavigationContainer>
            <Navigator>
                <Screen name="Home" component={Home} />
            </Navigator>
        </NavigationContainer>
    )
}



