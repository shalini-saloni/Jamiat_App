import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Switch, Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { CAMPAIGNS } from './HomeScreen';

const DONATION_TYPES = [
  { key: 'Zakat',   label: 'Zakat',   icon: 'mosque',             color: '#1B8A4C' },
  { key: 'Sadaqa',  label: 'Sadaqah', icon: 'hand-holding-heart', color: '#E91E8C' },
  { key: 'Fitrana', label: 'Fitrana', icon: 'utensils',           color: '#F57C00' },
  { key: 'General', label: 'General', icon: 'infinity',           color: '#607D8B' },
];

const DEDICATE_OPTIONS = ['For Myself', 'For Loved One', 'In Memory Of'];

const FREQUENCY_OPTIONS = [
  { key: 'One-Time', label: 'One-Time' },
  { key: 'Daily',    label: 'Daily' },
  { key: 'Weekly',   label: 'Weekly' },
  { key: 'Monthly',  label: 'Monthly' },
  { key: 'Yearly',   label: 'Yearly' },
];

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000, 15000, 25000];

export default function DonationScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { user, addDonation } = useApp();

  const campaign  = route?.params?.campaign;
  const initType  = route?.params?.donationType || 'Zakat';
  const initFreq  = route?.params?.frequency    || 'One-Time';

  const [selectedProject,  setSelectedProject]  = useState(campaign || CAMPAIGNS[0]);
  const [selectedType,     setSelectedType]     = useState(initType);
  const [dedicate,         setDedicate]         = useState('For Myself');
  const [frequency,        setFrequency]        = useState(initFreq);
  const [selectedAmount,   setSelectedAmount]   = useState(1000);
  const [customAmount,     setCustomAmount]     = useState('');
  const [taxBenefit,       setTaxBenefit]       = useState(true);
  const [message,          setMessage]          = useState('');
  const [processing,       setProcessing]       = useState(false);
  const [success,          setSuccess]          = useState(false);
  const [finalAmount,      setFinalAmount]      = useState(0);

  const currentAmount = customAmount ? (parseInt(customAmount) || 0) : selectedAmount;
  const totalContribution = currentAmount; 

  const handleProceed = () => {
    if (currentAmount < 50) {
      Alert.alert('Minimum Amount', 'Minimum donation amount is ₹50.');
      return;
    }
    setProcessing(true);
    setTimeout(async () => {
      setFinalAmount(currentAmount);
      await addDonation({
        name:      selectedProject?.title || `${selectedType} Donation`,
        amount:    currentAmount,
        type:      selectedType,
        campaign:  selectedProject?.title || null,
        frequency,
        dedicate,
        icon:      selectedType === 'Zakat' ? 'moon' : selectedType === 'Sadaqa' ? 'heart' : 'star',
        recurring: frequency !== 'One-Time',
      });
      setProcessing(false);
      setSuccess(true);
    }, 1400);
  };

  const goHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Tabs', state: { routes: [{ name: 'Home' }], index: 0 } }] });
  };

  const goImpact = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Tabs', state: { routes: [{ name: 'Home' }, { name: 'Project' }, { name: 'OurImpact' }], index: 2 } }] });
  };

  if (success) {
    return (
      <View style={[styles.successBg, { paddingTop: insets.top }]}>
        <View style={styles.successCard}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Jazakallah Khayran!</Text>
          <Text style={styles.successSub}>Your donation of</Text>
          <Text style={styles.successAmount}>₹{finalAmount.toLocaleString()}</Text>
          <Text style={styles.successMeta}>
            {selectedType} • {selectedProject?.title || 'General'}{frequency !== 'One-Time' ? ` • ${frequency}` : ''}
          </Text>
          <Text style={styles.successMsg}>
            May Allah accept your contribution and multiply your reward. Ameen.
          </Text>
          <TouchableOpacity style={styles.impactBtn} onPress={goImpact}>
            <Text style={styles.impactBtnText}>View My Impact →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', paddingTop: insets.top }}>
      {/* Green Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : goHome()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Make Your Donation</Text>
          <Text style={styles.headerSub}>Empowering the Ummah, one life at a time.</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={22} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>

      {/* Stats chips */}
      <View style={styles.statsBar}>
        {[['10K+ Donors', '#E8F5E9', '#1B8A4C'], ['25K+ Lives', '#E8F5E9', '#1B8A4C'], ['14 States', '#E8F5E9', '#1B8A4C']].map(([label, bg, color]) => (
          <View key={label} style={[styles.statChip, { backgroundColor: bg }]}>
            <Text style={[styles.statChipText, { color }]}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Step progress */}
      <View style={styles.stepperWrap}>
        {['CAUSE', 'AMOUNT', 'DETAILS', 'PAYMENT'].map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepItem}>
              <Text style={[styles.stepLabel, i <= 1 && styles.stepLabelActive]}>{s}</Text>
              <View style={[styles.stepDot, i <= 1 && styles.stepDotActive]} />
            </View>
            {i < 3 && <View style={[styles.stepLine, i < 1 && styles.stepLineActive]} />}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.stepSubtitle}>Step 2: Selection & Amount</Text>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Selected Project dropdown */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>SELECTED PROJECT</Text>
          <TouchableOpacity style={styles.projectDropdown}>
            <View style={styles.projectDotGreen} />
            <Text style={styles.projectDropdownText} numberOfLines={1}>{selectedProject?.title || 'Select Project'}</Text>
            <Ionicons name="chevron-down" size={16} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Donation Type 2×2 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DONATION TYPE</Text>
          <View style={styles.typeGrid}>
            {DONATION_TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                onPress={() => setSelectedType(t.key)}
                style={[styles.typeBtn, selectedType === t.key && { borderColor: t.color, backgroundColor: t.color + '12' }]}
              >
                <FontAwesome5 name={t.icon} size={16} color={selectedType === t.key ? t.color : '#aaa'} style={{ marginRight: 8 }} />
                <Text style={[styles.typeBtnText, selectedType === t.key && { color: t.color }]}>{t.label}</Text>
                {selectedType === t.key && (
                  <View style={[styles.typeCheck, { backgroundColor: t.color }]}>
                    <Ionicons name="checkmark" size={10} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dedicate */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DEDICATE THIS DONATION</Text>
          <View style={styles.dedicateRow}>
            {DEDICATE_OPTIONS.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setDedicate(d)}
                style={[styles.dedicateBtn, dedicate === d && styles.dedicateBtnActive]}
              >
                <Text style={[styles.dedicateBtnText, dedicate === d && styles.dedicateBtnTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frequency */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>FREQUENCY</Text>
          <View style={styles.freqGrid}>
            {FREQUENCY_OPTIONS.map((f) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFrequency(f.key)}
                style={[styles.freqBtn, frequency === f.key && styles.freqBtnActive]}
              >
                <Text style={[styles.freqBtnText, frequency === f.key && styles.freqBtnTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Choose Amount */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CHOOSE AMOUNT</Text>
          <View style={styles.amountGrid}>
            {PRESET_AMOUNTS.map((amt) => {
              const isActive = selectedAmount === amt && !customAmount;
              return (
                <TouchableOpacity
                  key={amt}
                  onPress={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  style={[styles.amountBtn, isActive && styles.amountBtnActive]}
                >
                  <Text style={[styles.amountText, isActive && styles.amountTextActive]}>
                    ₹{amt.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.customLabel}>Enter Custom Amount ( Min ₹ 50 )</Text>
          <View style={styles.customBox}>
            <Text style={styles.rupee}>₹</Text>
            <TextInput
              style={styles.customInput}
              placeholder={(selectedAmount || 1000).toLocaleString()}
              placeholderTextColor="#bbb"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={(v) => { setCustomAmount(v); setSelectedAmount(0); }}
            />
          </View>
        </View>

        {/* Tax Benefit */}
        <View style={styles.card}>
          <View style={styles.taxRow}>
            <View style={[styles.taxIconBox, { backgroundColor: '#FFF3E0' }]}>
              <FontAwesome5 name="receipt" size={15} color="#F57C00" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.taxTitle}>TAX BENEFIT</Text>
              <Text style={styles.taxSub}>Generate Tax Certificate (80G)</Text>
            </View>
            <Switch
              value={taxBenefit}
              onValueChange={setTaxBenefit}
              trackColor={{ false: '#ddd', true: '#1B8A4C' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Message */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>A MESSAGE OR DUA (OPTIONAL)</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Write your prayers or messages here..."
            placeholderTextColor="#bbb"
            multiline
            numberOfLines={3}
            value={message}
            onChangeText={setMessage}
          />
        </View>

        {/* Donation Summary */}
        <View style={styles.summaryWrap}>
          <Text style={styles.summaryTitle}>Donation Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Donation Amount</Text>
              <Text style={styles.summaryVal}>₹{currentAmount.toLocaleString()}.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Processing Fee</Text>
              <Text style={styles.summaryVal}>₹0.00</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalKey}>Total Contribution</Text>
              <Text style={styles.summaryTotalVal}>₹{totalContribution.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Proceed */}
        <TouchableOpacity
          style={[styles.proceedBtn, (processing || currentAmount < 50) && { opacity: 0.55 }]}
          onPress={handleProceed}
          disabled={processing || currentAmount < 50}
        >
          <Text style={styles.proceedText}>
            {processing ? 'Processing...' : 'Proceed to Pay →'}
          </Text>
        </TouchableOpacity>

        <View style={styles.razorRow}>
          <Ionicons name="shield-checkmark-outline" size={13} color="#aaa" />
          <Text style={styles.razorText}> SECURE PAYMENT POWERED BY RAZORPAY</Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Success
  successBg: { flex: 1, backgroundColor: '#F0FFF4', alignItems: 'center', justifyContent: 'center', padding: 24 },
  successCard: { backgroundColor: '#fff', borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 14, elevation: 6 },
  successEmoji: { fontSize: 52, marginBottom: 14 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#1B8A4C', marginBottom: 10 },
  successSub: { fontSize: 13, color: '#888', marginBottom: 2 },
  successAmount: { fontSize: 38, fontWeight: '900', color: '#1A1A1A', marginBottom: 4 },
  successMeta: { fontSize: 13, color: '#888', marginBottom: 16 },
  successMsg: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  impactBtn: { backgroundColor: '#1B8A4C', paddingVertical: 14, borderRadius: 13, alignItems: 'center', width: '100%', marginBottom: 10 },
  impactBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  homeBtn: { borderWidth: 1.5, borderColor: '#1B8A4C', paddingVertical: 13, borderRadius: 13, alignItems: 'center', width: '100%' },
  homeBtnText: { color: '#1B8A4C', fontWeight: '700', fontSize: 15 },

  // Header
  header: { backgroundColor: '#1B8A4C', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1 },

  // Stats chips
  statsBar: { backgroundColor: '#1B8A4C', flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 14, gap: 8 },
  statChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statChipText: { fontSize: 12, fontWeight: '700' },

  // Stepper
  stepperWrap: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 2 },
  stepItem: { alignItems: 'center' },
  stepLabel: { fontSize: 9, fontWeight: '700', color: '#ccc', letterSpacing: 0.5, marginBottom: 4 },
  stepLabelActive: { color: '#1B8A4C' },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ddd' },
  stepDotActive: { backgroundColor: '#1B8A4C' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#ddd', marginBottom: 4, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: '#1B8A4C' },
  stepSubtitle: { fontSize: 11, color: '#999', paddingHorizontal: 16, marginBottom: 8, marginTop: 2 },

  // Cards
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardLabel: { fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 0.8, marginBottom: 12 },

  // Project
  projectDropdown: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, padding: 12 },
  projectDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1B8A4C', marginRight: 10 },
  projectDropdownText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },

  // Type 2×2
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeBtn: { width: '47%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 13, borderRadius: 12, borderWidth: 1.5, borderColor: '#EBEBEB', backgroundColor: '#FAFAFA', position: 'relative' },
  typeBtnText: { fontSize: 14, color: '#aaa', fontWeight: '600' },
  typeCheck: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },

  // Dedicate
  dedicateRow: { flexDirection: 'row', gap: 8 },
  dedicateBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#E0E0E0', alignItems: 'center' },
  dedicateBtnActive: { borderColor: '#1B8A4C', backgroundColor: '#F0FFF4' },
  dedicateBtnText: { fontSize: 12, color: '#666', fontWeight: '500' },
  dedicateBtnTextActive: { color: '#1B8A4C', fontWeight: '700' },

  // Frequency
  freqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  freqBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#E0E0E0' },
  freqBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  freqBtnText: { fontSize: 13, color: '#666', fontWeight: '600' },
  freqBtnTextActive: { color: '#fff', fontWeight: '700' },

  // Amount
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  amountBtn: { width: '30%', paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#E0E0E0', alignItems: 'center' },
  amountBtnActive: { backgroundColor: '#1B8A4C', borderColor: '#1B8A4C' },
  amountText: { fontSize: 14, fontWeight: '700', color: '#444' },
  amountTextActive: { color: '#fff' },
  customLabel: { fontSize: 12, color: '#888', marginBottom: 8 },
  customBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#FAFAFA' },
  rupee: { fontSize: 16, color: '#555', fontWeight: '700', marginRight: 6 },
  customInput: { flex: 1, fontSize: 16, color: '#222', fontWeight: '600' },

  // Tax
  taxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taxIconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  taxTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  taxSub: { fontSize: 11, color: '#999', marginTop: 1 },

  // Message
  messageInput: { borderWidth: 1.5, borderColor: '#E8E8E8', borderRadius: 12, padding: 14, fontSize: 14, color: '#333', minHeight: 80, textAlignVertical: 'top', backgroundColor: '#FAFAFA' },

  // Summary
  summaryWrap: { marginHorizontal: 16, marginBottom: 12 },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 10 },
  summaryBox: { backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryKey: { fontSize: 14, color: '#777' },
  summaryVal: { fontSize: 14, color: '#444', fontWeight: '500' },
  summaryDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 10 },
  summaryTotalKey: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  summaryTotalVal: { fontSize: 22, fontWeight: '900', color: '#1B8A4C' },

  // Proceed
  proceedBtn: { marginHorizontal: 16, marginBottom: 6, backgroundColor: '#1B8A4C', paddingVertical: 16, borderRadius: 14, alignItems: 'center', shadowColor: '#1B8A4C', shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  proceedText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  razorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  razorText: { fontSize: 10, color: '#bbb', fontWeight: '600', letterSpacing: 0.5 },
});