
import './index.css'

import {useEffect, useRef, useState} from "react";
type SetFormValue<TValue = any> = <TFieldName extends string>(
    name: TFieldName,
    value: TValue,
    options?: {
        shouldValidate?: boolean;
        shouldDirty?: boolean;
        shouldTouch?: boolean;
    }
) => void;
interface SelectorProps {
    labelColor?: string;
    selectorColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderRadius?: string;
    px?: string;
    py?: string;
    searchColor?: string;
    optionsSize?: string;
    selectedColor?: string;
    selectedColorArray?: string;
    containerOptionsRadius?: string;
    colorHovered?: string;
    optionsTextColor?: string;
    search?: boolean;
    label?: string;
    apiFn?: (page: number, search: string) => Promise<any>;
    apiUrl?: string;
    array?: any[];
    KeyShowFn: (item: any) => string;
    getValue: (item: any) => any;
    multiSelect?: boolean;
    closeOnSelect?: boolean;
    nameFormHook?: string;
    setValueFormHook?: SetFormValue;
    defaultValues?: any[];
    value: string;
}

const RexSelector = (
    {
        defaultValues,
        value,
        labelColor = '#000',
        selectorColor = '#000',
        borderWidth = '2px',
        borderStyle = "solid",
        borderRadius = "10px",
        px = "10px",
        py = "12px",
        optionsTextColor = '#000',
        selectedColor = '#a2e1e1',
        selectedColorArray = '#92e0f9',
        search = false,
        searchColor = '#000',
        optionsSize = '50px',
        containerOptionsRadius = '5px',
        colorHovered = '#f0f0f0',
        label = 'Select ...',
        apiFn,
        apiUrl,
        array,
        KeyShowFn = (item: any) => item,
        getValue,
        multiSelect = false,
        closeOnSelect = true,
        nameFormHook,
        setValueFormHook,
    }: SelectorProps
) => {
    const transformArray = (arr?: any[]) => {
        if (arr && arr.length) {
            if(multiSelect){
                return {
                    key: arr.map(e => KeyShowFn(e)),
                    value: arr.map(e => e[value as keyof typeof e])
                };
            }else {
                return {
                    key: KeyShowFn(arr[0]),
                    value: arr[0][value as keyof typeof arr[0]]
                };
            }
        }
        return {key: [], value: []};
    };

    const [open, setOpen] = useState<boolean>(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [searchInput, setSearchInput] = useState<string>('');
    const [valueStore, setValueStore] = useState<{
        key: string | number | any[],
        value: string | number | any[]
    }>(transformArray(defaultValues));

    // إدارة التحميل التلقائي
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // دالة لتحميل البيانات من API
    const fetchData = async (page: number, search: string) => {
        setIsLoading(true);
        try {
            const response = apiFn
                ? await apiFn(page, search)
                : apiUrl
                    ? await fetch(`${apiUrl}?page=${page}&search=${search}`).then(res => res.json())
                    : {data: []};
            let res = Array.isArray(response.data) ? response.data : response.data.data;

            if (res && Array.isArray(res)) {
                if (page === 1) {
                    setData(res); // إعادة تعيين البيانات إذا كانت الصفحة الأولى
                } else {
                    setData(prevData => [...prevData, ...res]); // إضافة البيانات الجديدة
                }
                setHasMore(res.length > 0); // تحديد ما إذا كانت هناك المزيد من البيانات
            } else {
                setData([]); // إعادة تعيين البيانات إذا كانت response.data غير صالحة
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // تحميل البيانات الأولى عند تغيير searchInput
    useEffect(() => {
        setData([]); // إعادة تعيين البيانات إلى مصفوفة فارغة
        setPage(1); // إعادة تعيين الصفحة
        fetchData(1, searchInput);
    }, [searchInput]);

    // تحميل المزيد من البيانات عند تغيير الصفحة
    useEffect(() => {
        if (page > 1) {
            fetchData(page, searchInput);
        }
    }, [page]);

    // دالة التحميل التلقائي عند الوصول إلى نهاية القائمة
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const {scrollTop, scrollHeight, clientHeight} = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 5 && hasMore && !isLoading) {
            setPage(prevPage => prevPage + 1); // تحميل الصفحة التالية
        }
    };

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) ||
                (selectRef.current && selectRef.current.contains(event.target as Node))
            ) {
                return;
            }
            setOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        getValue(valueStore.value);
        if (nameFormHook && setValueFormHook) {
            setValueFormHook(nameFormHook, valueStore.value);
        }
    }, [valueStore]);

    const handleShowValue = () => {
        return (
            <div className={'showValue'}
                 style={{display: `${Array.isArray(valueStore.key) && valueStore.key.length || (String(valueStore.key) && valueStore.key) ? 'flex' : 'none'}`}}>
                {multiSelect && Array.isArray(valueStore.key) ? (
                    valueStore.key.map((e, index) => (
                        <span
                            style={{backgroundColor: selectedColor}}
                            key={index}
                            onClick={() => {
                                if (Array.isArray(valueStore.key) && Array.isArray(valueStore.value)) {
                                    const newKeys = valueStore.key.filter((_, i) => i !== index);
                                    const newValues = valueStore.value.filter((_, i) => i !== index);
                                    setValueStore({key: newKeys, value: newValues});
                                }
                            }}
                        >
              {e}
            </span>
                    ))
                ) : (
                    <span style={{backgroundColor: selectedColor}} onClick={() => setValueStore({key: '', value: ''})}>
            {valueStore.key}
          </span>
                )}
            </div>
        );
    };

    const handleLabel = (className: string) => {
        return (
            <p
                className={className}
                style={{
                    color: `${labelColor}`,
                    left: `${px}`,
                    display: `${Array.isArray(valueStore.key) && valueStore.key.length || (String(valueStore.key) && valueStore.key) ? 'none' : ""}`
                }}
            >
                {label}
            </p>
        );
    };

    const handleSearchArray = (searchInput: string) => {
        if (array && search) {
            return array.filter((item) => {
                return KeyShowFn(item).includes(searchInput)
            })
        } else {
            return array
        }
    }

    const flattenedData = array ? handleSearchArray(searchInput) : data;

    return (
        <div style={{width: '40%', margin: '50px'}}>
            <div className={'containerS'}>
                {/*------------------------------------------------------------------------------------------------------------------Selector*/}
                <div
                    className={'selectOne'}
                    ref={selectRef}
                    onClick={() => setOpen(prev => !prev)}
                    style={{
                        border: `${borderWidth} ${selectorColor} ${borderStyle}`,
                        borderRadius: `${borderRadius}`,
                        padding: `${py} ${px}`
                    }}
                >
                    {handleShowValue()}
                    {handleLabel("labelSelectorOne")}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{rotate: `${open ? "90deg" : ""}`}}
                        className={'arrowSelectorOne'}
                        viewBox="0 0 12 24"
                    >
                        <defs>
                            <path
                                id="weuiArrowOutlined0"
                                fill={selectorColor}
                                d="m7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 0 1 0-1.413L6.527.52l1.06 1.06l-5.424 5.425z"
                            />
                        </defs>
                        <use fillRule="evenodd" href="#weuiArrowOutlined0" transform="rotate(-180 5.02 9.505)"/>
                    </svg>
                </div>
                {/*------------------------------------------------------------------------------------------------------------------Options*/}
                <div
                    ref={dropdownRef}
                    className={'containerOptions'}
                    onScroll={(e) => handleScroll(e)}
                    style={{borderRadius: `${containerOptionsRadius}`, display: `${open ? "" : "none"}`}}
                >
                    {/*-----------------------------------------------------------------------------------------------------------search*/}
                    <input
                        placeholder={'search ...'}
                        className={'searchInput'}
                        type={'text'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
                        style={{
                            color: `${searchColor}`,
                            border: `1px ${selectorColor} ${borderStyle}`,
                            display: `${search ? "" : "none"}`
                        }}
                    />

                    {flattenedData?.map((item, index) => {
                        const isSelected = multiSelect
                            ? Array.isArray(valueStore.value) && valueStore.value.includes(item[value as keyof typeof item])
                            : valueStore.key === KeyShowFn(item);

                        return (
                            <div
                                onClick={() => {
                                    if (multiSelect) {
                                        if (Array.isArray(valueStore.key) && Array.isArray(valueStore.value) && !isSelected) {
                                            setValueStore({
                                                key: [...valueStore.key, KeyShowFn(item)],
                                                value: [...valueStore.value, item[value as keyof typeof item]]
                                            });
                                        }
                                    } else {
                                        setValueStore({
                                            key: KeyShowFn(item),
                                            value: item[value as keyof typeof item]
                                        });
                                    }
                                    if (!multiSelect && closeOnSelect) {
                                        setOpen(false);
                                    }
                                }}
                                key={index}
                                style={{
                                    height: `${optionsSize}`,
                                    backgroundColor: isSelected ? selectedColorArray : hoveredIndex === index ? colorHovered : "",
                                    transition: "background-color 0.3s ease"
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <p style={{color: `${optionsTextColor}`}}>{KeyShowFn(item)}</p>
                            </div>
                        );
                    })}
                    {isLoading && <div className={'loadingOptions'}>Loading...</div>}
                </div>
            </div>
        </div>
    );
};

export default RexSelector;