// Добавьте эти переменные в начало компонента EditableTable
const [geocodeCache, setGeocodeCache] = useState({});
const [distanceCache, setDistanceCache] = useState({});
const [pendingDistanceCalculations, setPendingDistanceCalculations] = useState([]);
const [isCalculatingDistances, setIsCalculatingDistances] = useState(false);

// Замените существующий geocodeAddress на кэширующую версию
const geocodeAddress = async (address) => {
    if (!address) return null;
    
    // Проверяем кэш
    if (geocodeCache[address]) {
        return geocodeCache[address];
    }
    
    try {
        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                address
            )}.json?access_token=sk.eyJ1IjoiY29ubmV4MTIzNCIsImEiOiJjbTgxcGl1ZG8weXR1MmtzNnc4eW9vYmpjIn0.pQeztEZaqpks61Paf4g_pw`
        );
        const features = response.data.features;
        
        if (features.length > 0) {
            const coordinates = features[0].center;
            // Сохраняем в кэш
            setGeocodeCache(prev => ({...prev, [address]: coordinates}));
            return coordinates;
        } else {
            console.error("No coordinates found for the address:", address);
            return null;
        }
    } catch (error) {
        console.error("Error geocoding address:", error);
        return null;
    }
};

// Заменить calculateDistance на кэширующую версию
const calculateDistance = async (origin, destination) => {
    if (!origin || !destination) return null;
    
    // Создаем уникальный ключ для пары origin-destination
    const cacheKey = `${origin}|${destination}`;
    
    // Проверяем кэш расстояний
    if (distanceCache[cacheKey]) {
        return distanceCache[cacheKey];
    }
    
    try {
        const originCoordinates = await geocodeAddress(origin);
        const destinationCoordinates = await geocodeAddress(destination);
        
        if (originCoordinates && destinationCoordinates) {
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoordinates[0]},${originCoordinates[1]};${destinationCoordinates[0]},${destinationCoordinates[1]}?access_token=sk.eyJ1IjoiY29ubmV4MTIzNCIsImEiOiJjbTgxcGl1ZG8weXR1MmtzNnc4eW9vYmpjIn0.pQeztEZaqpks61Paf4g_pw`
            );
            const distance = response.data.routes[0].distance / 1609.34;
            
            // Сохраняем в кэш
            setDistanceCache(prev => ({...prev, [cacheKey]: distance}));
            return distance;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error calculating distance:", error);
        return null;
    }
};

// Новая функция для вычисления расстояний с ограничением одновременных запросов
const calculateDistancesInBatches = async (trucksToUpdate, destination) => {
    setIsCalculatingDistances(true);
    const batchSize = 5; // Ограничиваем до 5 одновременных запросов
    const updatedTrucks = [...trucks];
    
    // Разбиваем на партии
    for (let i = 0; i < trucksToUpdate.length; i += batchSize) {
        const batch = trucksToUpdate.slice(i, i + batchSize);
        
        // Параллельно обрабатываем партию
        await Promise.all(
            batch.map(async (truck) => {
                const distance = await calculateDistance(truck.CityStateZip, destination);
                const truckIndex = updatedTrucks.findIndex(t => t.ID === truck.ID);
                
                if (truckIndex !== -1) {
                    updatedTrucks[truckIndex] = {
                        ...updatedTrucks[truckIndex],
                        distance: distance ? Math.round(distance) : null
                    };
                }
            })
        );
        
        // Обновляем состояние после каждой партии
        setTrucks([...updatedTrucks]);
        
        // Добавляем небольшую задержку между партиями, чтобы избежать блокировки API
        if (i + batchSize < trucksToUpdate.length) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
    
    setIsCalculatingDistances(false);
};

// Заменить handleDestinationChange на версию с пакетной обработкой
const handleDestinationChange = (value) => {
    localStorage.setItem("destination", value);
    setDestinationValue(value);
    
    // Обновляем все truck.Destination без перерасчета расстояний
    const updatedTrucks = trucks.map((truck) => {
        return {
            ...truck,
            Destination: value,
        };
    });
    
    setTrucks(updatedTrucks);
    
    // Запускаем расчет расстояний в пакетном режиме
    calculateDistancesInBatches(updatedTrucks, value);
};

// Добавить индикатор загрузки для расчета расстояний в render методе
// в таблице можно добавить спиннер в колонку Distance
{
    title: "Distance",
    key: "Distance",
    sorter: (a, b) => a.distance - b.distance,
    render: (text, record) => (
        <p>
            {isCalculatingDistances && record.distance === undefined ? (
                <span>Calculating...</span>
            ) : (
                `${record.distance || 'N/A'} mil.`
            )}
        </p>
    ),
},