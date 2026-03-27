import * as DocumentPicker from 'expo-document-picker';
import { Camera, ChevronDownIcon, ImageIcon, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// API & UI Components
import { addCar } from '@/api/car_api';
import { getAllCarBrands } from '@/api/car_brand';
import { uploadFileToSupabase } from '@/api/image_upload';
import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { CreateCar } from '@/types/car';
import { CarBrand } from '@/types/carBrand';

export default function AddCar() {
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [brands, setBrands] = useState<CarBrand[]>([]);

    const [car, setCar] = useState<CreateCar>({
        name: '',
        brandId: '',
        carNumber: '',
        price: 0,
        imageUrl: ''
    });

    const getCarBrands =  async () => {
      const carBrands =  await getAllCarBrands();
      setBrands(carBrands);
    }

    

    const isFormValid = car.name && car.brandId && selectedImage && car.price;

    const handleImagePick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
            if (!result.canceled && result.assets) {
                setSelectedImage(result.assets[0]);
            }
        } catch (error) {
            Alert.alert("Error", "Could not open gallery");
        }
    };


    

    const getBrandLabel = (id: string) => {
        const brand = brands.find(b => b.id === id);
        return brand ? brand.name : 'Select a brand';
    };

    const handleUploadImage = async () => {
        if (!selectedImage) return;
        const fileName = `cars/${Date.now()}_${selectedImage.name}`;

        const imageUrl = await uploadFileToSupabase(selectedImage, 'car_show_room', fileName);
        return imageUrl;
    }

    const handleAddCar = async () => {
        try {
            setIsLoading(true)
            const imageUrl = await handleUploadImage();
            if (!imageUrl) {
                Alert.alert("Error", "Image upload failed");
                setIsLoading(false);
                return;
            }
            const result = await addCar({ ...car, imageUrl: imageUrl });
            if (result) {
                Alert.alert("Success", "Car brand added successfully");
                setCar({
                    name: '',
                    imageUrl: '',
                    brandId: '',
                    carNumber: '',
                    price: 0

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
    useEffect(() => {
        getCarBrands()
    }, [])

    return (
        <Box className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                    className="p-6"
                    keyboardShouldPersistTaps="always"
                >
                    <VStack space="xl">
                        <Heading size="2xl" className="text-slate-900 text-center mt-4">Register Car</Heading>

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="text-slate-600 font-bold">Model Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input className="border-slate-200 h-12 bg-slate-50 rounded-xl">
                                <InputField
                                    value={car.name}
                                    onChangeText={(val) => setCar({ ...car, name: val })}
                                    placeholder="Enter car model"
                                />
                            </Input>
                        </FormControl>

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="text-slate-600 font-bold">Select Brand </FormControlLabelText>
                            </FormControlLabel>
                            <TouchableOpacity
                                onPress={() => setShowBrandModal(true)}
                                className="border border-slate-200 h-12 bg-slate-50 rounded-xl flex-row items-center justify-between px-4"
                            >
                                <Text className={car.brandId ? "text-slate-900" : "text-slate-400"}>
                                    {car.brandId ? getBrandLabel(car.brandId) : "Choose a brand"}
                                </Text>
                                <ChevronDownIcon size={20} color="#64748b" />
                            </TouchableOpacity>

                            <Modal
                                visible={showBrandModal}
                                transparent={true}
                                animationType="slide"
                            >
                                <Pressable
                                    className="flex-1 bg-black/50 justify-end"
                                    onPress={() => setShowBrandModal(false)}
                                >
                                    <Box className="bg-white rounded-t-3xl p-6">
                                        <Text className="text-xl font-bold mb-4">Select Brand</Text>
                                        {brands.map((brand) => (
                                            <TouchableOpacity
                                                key={brand.name}
                                                onPress={() => {
                                                    setCar({ ...car, brandId: brand.id });
                                                    setShowBrandModal(false);
                                                }}
                                                className="py-4 border-b border-slate-100"
                                            >
                                                <Text className="text-lg">{brand.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                        <TouchableOpacity
                                            onPress={() => setShowBrandModal(false)}
                                            className="mt-4 py-3 bg-slate-100 rounded-xl"
                                        >
                                            <Text className="text-center text-slate-600">Cancel</Text>
                                        </TouchableOpacity>
                                    </Box>
                                </Pressable>
                            </Modal>
                        </FormControl>

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="text-slate-600 font-bold">Car Number</FormControlLabelText>
                            </FormControlLabel>
                            <Input className="border-slate-200 h-12 bg-slate-50 rounded-xl">
                                <InputField
                                    value={car.carNumber}
                                    onChangeText={(val) => setCar({ ...car, carNumber: val })}
                                    placeholder="Enter car number"
                                    autoCapitalize="characters"
                                />
                            </Input>
                        </FormControl>

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="text-slate-600 font-bold">Rent Price ($/Day)</FormControlLabelText>
                            </FormControlLabel>
                            <Input className="border-slate-200 h-12 bg-slate-50 rounded-xl">
                                <InputField
                                    keyboardType="numeric"
                                    value={car.price.toString()}
                                    onChangeText={(val) => setCar({ ...car, price: Number(val) })}
                                    placeholder="Enter price"
                                />
                            </Input>
                        </FormControl>

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="text-slate-600 font-bold">Car Photo</FormControlLabelText>
                            </FormControlLabel>
                            <Pressable onPress={handleImagePick}>
                                <Box className="w-full h-48 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50 overflow-hidden items-center justify-center">
                                    {selectedImage ? (
                                        <Box className="w-full h-full">
                                            <Image source={{ uri: selectedImage.uri }} className="w-full h-full" resizeMode="cover" />
                                            <Box className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-full shadow-md">
                                                <Camera size={20} color="#1e293b" />
                                            </Box>
                                        </Box>
                                    ) : (
                                        <VStack space="xs" className="items-center">
                                            <Box className="bg-blue-100 p-4 rounded-full">
                                                <ImageIcon size={30} color="#3b82f6" />
                                            </Box>
                                            <Text className="font-bold text-slate-700">Add Car Image</Text>
                                        </VStack>
                                    )}
                                </Box>
                            </Pressable>
                            {selectedImage && (
                                <Pressable onPress={() => setSelectedImage(null)} className="flex-row items-center mt-2 justify-center">
                                    <Trash2 size={16} color="#ef4444" />
                                    <Text className="text-red-500 text-sm ml-2">Remove</Text>
                                </Pressable>
                            )}
                        </FormControl>

                        <Box className="mt-4 mb-10">
                            <Button
                                size="xl"
                                className={`rounded-2xl h-16 shadow-lg ${!isFormValid ? 'bg-slate-200' : 'bg-blue-600'}`}
                                isDisabled={!isFormValid || isLoading}
                                onPress={handleAddCar}
                            >
                                {isLoading ? <ButtonSpinner /> : (
                                    <ButtonText className={`font-bold text-lg ${!isFormValid ? 'text-slate-400' : 'text-white'}`}>
                                        Confirm Car Registration
                                    </ButtonText>
                                )}
                            </Button>
                        </Box>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </Box>
    );
}