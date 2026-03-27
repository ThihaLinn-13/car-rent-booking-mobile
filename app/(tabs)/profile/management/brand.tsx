import { addCarBrand } from '@/api/car_brand';
import { uploadFileToSupabase } from '@/api/image_upload';
import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { CreateCarBrand } from '@/types/carBrand';
import * as DocumentPicker from 'expo-document-picker';
import { Camera, ImageIcon, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, Keyboard, Pressable, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Car() {
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [carBrand, setCarBrand] = useState<CreateCarBrand>({
        name: '',
        imageUrl: '',
    });

    const handleAddCarBrand = async () => {
        try {
            setIsLoading(true)
            const imageUrl = await handleUploadImage();

            if (!imageUrl) {
                Alert.alert("Error", "Image upload failed");
                setIsLoading(false);
                return;
            }

            const result = await addCarBrand({ ...carBrand, imageUrl: imageUrl });
            if (result) {
                Alert.alert("Success", "Car brand added successfully");
                setCarBrand({
                    name: '',
                    imageUrl: '',
                });
                setSelectedImage(null);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error adding car brand:", error);
            Alert.alert("Error", "Failed to add car brand");
            setIsLoading(false);
            return;
        }

    }

    const handleUploadImage = async () => {
        if (!selectedImage) return;
            const fileName = `car_brands/${Date.now()}_${selectedImage.name}`;

        const imageUrl = await uploadFileToSupabase(selectedImage, 'car_show_room', fileName);
        return imageUrl;
    }

    const handleImagePick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "image/*",
                copyToCacheDirectory: true,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0]);
            }
        } catch (error) {
            Alert.alert("Error", "Could not open gallery");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <VStack space="xl" className="p-6">

                <VStack space="xs" className="mt-4">
                    <Heading size="2xl" className="text-slate-900 text-center">Car brand</Heading>
                </VStack>

                <FormControl size="md">
                    <FormControlLabel>
                        <FormControlLabelText className="text-slate-600 font-bold">Name</FormControlLabelText>
                    </FormControlLabel>
                    <Input className="border-slate-200 h-12 bg-slate-50 rounded-xl focus:border-slate-200">
                        <InputField
                            className='border-outline-0'
                            value={carBrand.name}
                            onChangeText={(name) => setCarBrand({ ...carBrand, name: name })}
                        />
                    </Input>
                </FormControl>

                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText className="text-slate-600 font-bold">Photo</FormControlLabelText>
                    </FormControlLabel>

                    <Pressable onPress={handleImagePick}>
                        <Box className="w-full h-64 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50 overflow-hidden items-center justify-center">
                            {selectedImage ? (
                                <Box className="w-full h-full">
                                    <Image
                                        source={{ uri: selectedImage.uri }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                    <Box className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-md">
                                        <Camera size={20} color="#1e293b" />
                                    </Box>
                                </Box>
                            ) : (
                                <VStack space="sm" className="items-center">
                                    <Box className="bg-blue-100 p-5 rounded-full">
                                        <ImageIcon size={40} color="#3b82f6" />
                                    </Box>
                                    <Text className="font-bold text-slate-700 mt-2">Add Brand Photo</Text>
                                    <Text className="text-xs text-slate-400">Tap to browse gallery</Text>
                                </VStack>
                            )}
                        </Box>
                    </Pressable>

                    {selectedImage && (
                        <Pressable
                            className="flex-row items-center mt-3 justify-center"
                            onPress={() => setSelectedImage(null)}
                        >
                            <Trash2 size={16} color="#ef4444" />
                            <Text className="text-red-500 text-sm font-medium ml-2">Remove Photo</Text>
                        </Pressable>
                    )}
                </FormControl>

                <Box className="mt-auto pb-6">
                    <Button
                        size="xl"
                        className={`rounded-2xl h-16 shadow-lg ${(!carBrand.name || !selectedImage) ? 'bg-slate-200' : 'bg-blue-600'}`}
                        isDisabled={!carBrand.name || !selectedImage || isLoading}
                        onPress={() => handleAddCarBrand()}
                    >
                        {isLoading && <ButtonSpinner />}
                        <ButtonText className={`font-bold text-lg ${(!carBrand.name || !selectedImage) ? 'text-black' : 'text-white'}`}>Confirm Registration</ButtonText>
                    </Button>
                </Box>

            </VStack>
        </Box>
        </TouchableWithoutFeedback>
    );
}