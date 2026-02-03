import { motion } from "framer-motion";

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-[9999]">
            <div className="relative">
                {/* Decorative background blurs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />

                <div className="flex flex-col items-center">
                    <motion.div
                        animate={{
                            rotate: 360,
                            borderRadius: ["25%", "50%", "25%"],
                        }}
                        transition={{
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            borderRadius: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-16 h-16 border-t-4 border-l-4 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] mb-6"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-2">
                            Authenticating
                        </h3>
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2
                                    }}
                                    className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
